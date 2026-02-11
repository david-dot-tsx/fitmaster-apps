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

import { type ExerciseListOutput, type ExerciseBaseWithId } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { ActionButtonsCell } from "@/components/table/cells/action-buttons-cell";
import { DateCell } from "@/components/table/cells/date-cell";
import { ImageCell } from "@/components/table/cells/image-cell";
import { TextTruncatedCell } from "@/components/table/cells/text-truncated-cell";
import { TextCell } from "@/components/table/cells/text-cell";
import { DeleteDialog } from "@/components/delete-dialog";

const columnHelper = createColumnHelper<ExerciseListOutput[number]>();

export const ExerciseTable = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseBaseWithId | null>(null);
  const { data, status: listStatus, error } = useQuery(trpc.exercise.list.queryOptions());

  const { mutate: deleteExercise, status: deleteStatus } = useMutation(
    trpc.exercise.delete.mutationOptions({
      onSuccess: () => {
        alert("Exercise deleted!");
        setOpenDeleteDialog(false);
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
      },
    }),
  );

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <TextCell className="text-nowrap" text={row.original.name} />,
      }),
      columnHelper.accessor("difficulty", {
        header: "Difficulty",
        cell: ({ row }) => (
          <TextCell
            className="text-center font-bold text-amber-500"
            text={row.original.difficulty}
          />
        ),
      }),
      columnHelper.accessor("bodyPart", {
        header: "Body Part",
        cell: ({ row }) => (
          <TextCell className="text-center font-bold text-amber-500" text={row.original.bodyPart} />
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ row }) => <TextTruncatedCell text={row.original.description ?? ""} />,
      }),
      columnHelper.accessor("imageUrl", {
        size: 100,
        header: "Image",
        cell: ({ row }) => <ImageCell src={row.original.imageUrl} alt="Image" />,
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ row }) => <DateCell className="text-center" date={row.original.createdAt} />,
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: ({ row }) => <DateCell className="text-center" date={row.original.updatedAt} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionButtonsCell
            className="m-0 ml-auto"
            editLink={`/dashboard/exercise/${row.original.id}/edit`}
            onDelete={() => {
              setOpenDeleteDialog(true);
              setExerciseToDelete(row.original);
            }}
          />
        ),
      }),
    ];
  }, [setOpenDeleteDialog]);

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (listStatus === "pending") {
    // TODO: improve
    return <div>Loading...</div>;
  }
  if (listStatus === "error") {
    // TODO: improve
    return <div>Error: {error?.message}</div>;
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
      <div className="flex w-full flex-col">
        <table className="w-full max-w-full table-auto border-collapse flex-col overflow-hidden rounded-xl">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-nowrap bg-amber-400 p-2 text-background">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer rounded-sm even:bg-slate-900/50 hover:bg-amber-400/10"
                onClick={() => {
                  router.push(`/dashboard/exercise/${row.original.id}`);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </>
  );
};
