"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { type ExerciseListOutput, type ExerciseBaseWithId, Difficulty } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { ActionButtonsCell } from "@/components/table/cells/action-buttons-cell";
import { ImageCell } from "@/components/table/cells/image-cell";
import { DeleteDialog } from "@/components/delete-dialog";
import { cn } from "@/lib/utils";
import { EditExerciseDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/_components/edit-exercise-dialog";
import { Badge } from "@/components/ui/badge";
import { TextTruncatedCell } from "@/components/table/cells/text-truncated-cell";
import { DATE_FORMATS } from "@/consts/date-formats";
import { DateCell } from "@/components/table/cells/date-cell";
import { LoadingState } from "@/components/query/loading-state";
import { ErrorState } from "@/components/query/error-state";
import { NoDataFoundRow } from "@/components/table/no-data-found-row";

const columnHelper = createColumnHelper<ExerciseListOutput[number]>();

export const ExerciseTable = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseBaseWithId | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<ExerciseBaseWithId | null>(null);
  const { data, status: listStatus, refetch } = useQuery(trpc.exercise.list.queryOptions());

  const { mutate: deleteExercise, status: deleteStatus } = useMutation(
    trpc.exercise.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Exercise deleted!");
        setOpenDeleteDialog(false);
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
      },
      onError: (error) => {
        toast.error("Failed to delete exercise");
        console.error(error);
        setOpenDeleteDialog(false);
      },
    }),
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Exercise Name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-zinc-200 transition-colors group-hover:text-amber-400">
              {row.original.name}
            </span>
            <span className="text-[10px] uppercase tracking-tighter text-zinc-600">
              ID: {row.original.id.slice(0, 8)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("difficulty", {
        header: "Intensity",
        cell: ({ getValue }) => {
          const value = getValue();

          return (
            <Badge
              className={cn(
                "border bg-transparent text-[10px] font-black uppercase tracking-widest",
                {
                  "border-red-500/50 text-red-500": value === Difficulty.HARD,
                  "border-amber-400/50 text-amber-400": value === Difficulty.MEDIUM,
                  "border-emerald-500/50 text-emerald-500": value === Difficulty.EASY,
                },
              )}
            >
              {value}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("bodyPart", {
        header: "Target",
        cell: ({ getValue }) => (
          <span className="text-xs font-bold uppercase italic tracking-tight text-zinc-400">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Protocol Details",
        cell: ({ getValue }) => (
          <TextTruncatedCell
            text={getValue() || "—"}
            className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400"
          />
        ),
      }),
      columnHelper.accessor("imageUrl", {
        header: "Preview",
        cell: ({ row }) => (
          <div className="relative h-10 w-16 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-amber-400/30">
            <ImageCell src={row.original.imageUrl} alt="Image" className="object-cover" />
          </div>
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Last Update",
        cell: ({ getValue }) => (
          <DateCell
            date={getValue()}
            dateFormat={DATE_FORMATS.DATE}
            className="font-mono text-[10px] text-zinc-600"
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <ActionButtonsCell
              onDelete={() => {
                setOpenDeleteDialog(true);
                setExerciseToDelete(row.original);
              }}
              onEdit={() => {
                setExerciseToEdit(row.original);
                setOpenEditDialog(true);
              }}
            />
          </div>
        ),
      }),
    ],
    [setOpenDeleteDialog],
  );

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (listStatus === "pending") {
    return <LoadingState message="Loading exercises…" />;
  }
  if (listStatus === "error") {
    return <ErrorState title="Failed to load exercises" onTryAgain={refetch} />;
  }

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={() => {
          if (exerciseToDelete) {
            deleteExercise({ id: exerciseToDelete.id });
            setExerciseToDelete(null);
          }
        }}
        entityName={exerciseToDelete?.name ?? ""}
        status={deleteStatus}
      />
      <EditExerciseDialog
        exercise={exerciseToEdit}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />
      <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-2xl backdrop-blur-md">
        <table className="w-full table-auto border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800 bg-zinc-900/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group cursor-pointer transition-colors hover:bg-amber-400/[0.03]"
                onClick={() => router.push(`/dashboard/exercise/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn("p-4 transition-colors group-hover:text-zinc-100", {
                      "w-full": cell.column.id === "description",
                      "min-w-56": cell.column.id === "name",
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data?.length === 0 && <NoDataFoundRow colSpan={columns.length} />}
          </tbody>
        </table>
      </div>
    </>
  );
};
