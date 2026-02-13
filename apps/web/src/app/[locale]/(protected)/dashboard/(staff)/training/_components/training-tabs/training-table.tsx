"use client";
import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { type Training, TrainingStatus, type TrainingListStaffOutput } from "@repo/validators";

import { TextCell } from "@/components/table/cells/text-cell";
import { TextTruncatedCell } from "@/components/table/cells/text-truncated-cell";
import { ImageCell } from "@/components/table/cells/image-cell";
import { DateCell } from "@/components/table/cells/date-cell";
import { ActionButtonsCell } from "@/components/table/cells/action-buttons-cell";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { useTRPC } from "@/lib/trpc/client";
import { EditTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/edit-training-dialog";

const columnHelper = createColumnHelper<TrainingListStaffOutput[number]>();

interface TrainingTableProps {
  trainings: TrainingListStaffOutput;
}

export const TrainingTable = ({ trainings }: TrainingTableProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState<Training | null>(null);

  const { mutate: deleteTraining, status: deleteStatus } = useMutation(
    trpc.training.delete.mutationOptions({
      onSuccess: () => {
        alert("Training deleted!");
        setOpenDeleteDialog(false);
        queryClient.invalidateQueries(
          trpc.training.listStaff.queryOptions({
            status: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
          }),
        );
      },
    }),
  );
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <TextCell className="text-nowrap" text={row.original.name} />,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => <TextCell className="text-nowrap" text={row.original.status} />,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ row }) => <TextTruncatedCell text={row.original.description ?? ""} />,
      }),
      columnHelper.accessor("imageUrl", {
        size: 100,
        header: "Image",
        cell: ({ row }) => <ImageCell src={row.original.imageUrl ?? ""} alt="Image" />,
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ row }) => <DateCell date={row.original.createdAt} />,
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: ({ row }) => <DateCell date={row.original.updatedAt} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionButtonsCell
            onEdit={() => {
              setTrainingToEdit(row.original);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setTrainingToDelete(row.original);
              setOpenDeleteDialog(true);
            }}
          />
        ),
      }),
    ];
  }, []);

  const table = useReactTable({
    data: trainings,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={() => {
          if (trainingToDelete) {
            deleteTraining({ id: trainingToDelete.id });
            setTrainingToDelete(null);
          }
        }}
        entityName={trainingToDelete?.name ?? ""}
        status={deleteStatus}
      />
      <EditTrainingDialog
        training={trainingToEdit}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
      />
      <table className="w-full max-w-full table-auto border-collapse flex-col overflow-hidden rounded-xl">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-nowrap bg-amber-400 p-2">
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
                router.push(`/dashboard/training/${row.original.id}`);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn("border p-2", {
                    "w-full": cell.column.id === "description",
                  })}
                >
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
    </>
  );
};
