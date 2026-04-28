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
import { toast } from "sonner";

import {
  type Training,
  TrainingStatus,
  type TrainingListStaffOutput,
  type Role,
} from "@repo/validators";

import { TextTruncatedCell } from "@/components/table/cells/text-truncated-cell";
import { ImageCell } from "@/components/table/cells/image-cell";
import { DateCell } from "@/components/table/cells/date-cell";
import { ActionButtonsCell } from "@/components/table/cells/action-buttons-cell";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { useTRPC } from "@/lib/trpc/client";
import { EditTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/edit-training-dialog";
import { Badge } from "@/components/ui/badge";
import { DATE_FORMATS } from "@/consts/date-formats";
import { NoDataFoundRow } from "@/components/table/no-data-found-row";
import {
  UpdateStatusDialog,
  UpdateTrainingStatusSelect,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/update-status-dialog";
import { useT } from "@/lib/i18n/i18n";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

const columnHelper = createColumnHelper<TrainingListStaffOutput[number]>();
const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "border-zinc-500 text-zinc-500 bg-zinc-500/10 hover:bg-zinc-500/30",
  },
  READY_TO_PUBLISH: {
    label: "Ready",
    color:
      "border-blue-400 text-blue-400 bg-blue-400/10 shadow-[0_0_10px_rgba(96,165,250,0.2)] hover:bg-blue-400/30",
  },
  PUBLISHED: {
    label: "Live",
    color:
      "border-emerald-500 text-emerald-500 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:bg-emerald-500/30",
  },
  HIDDEN: {
    label: "Hidden",
    color: "border-orange-500 text-orange-500 bg-orange-500/10 hover:bg-orange-500/30",
  },
  DISABLED: {
    label: "Disabled",
    color: "border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/30",
  },
};
interface TrainingTableProps {
  trainings: TrainingListStaffOutput;
  userRole: Role;
}

export const TrainingTable = ({ trainings, userRole }: TrainingTableProps) => {
  const { t } = useT();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState<Training | null>(null);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [trainingToUpdateStatus, setTrainingToUpdateStatus] = useState<Training | null>(null);
  const [trainingNewStatus, setTrainingNewStatus] = useState<TrainingStatus | null>(null);

  const { mutate: deleteTraining, status: deleteStatus } = useMutation(
    trpc.training.delete.mutationOptions({
      onSuccess: () => {
        toast.success(t("success.generic.description"));
        setOpenDeleteDialog(false);
        queryClient.invalidateQueries(
          trpc.training.listStaff.queryOptions({
            status: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
          }),
        );
      },
      onError: (error) => {
        handleApiErrorMessage(error.message, {
          default: (translatedMessage: string) => {
            toast.error(translatedMessage);
            setOpenDeleteDialog(false);
          },
        });
      },
    }),
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("web:table.training.columns.name.label"),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-black uppercase italic tracking-tight text-zinc-200 transition-colors group-hover:text-amber-400">
              {row.original.name}
            </span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
              {t("web:table.training.columns.id.label")}: {row.original.id.slice(0, 8)}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("web:table.training.columns.status.label"),
        cell: ({ getValue }) => {
          const status = getValue() as keyof typeof statusConfig;
          const config = statusConfig[status] || statusConfig.DRAFT;

          return (
            <Badge
              className={cn(
                "h-5 border px-2 text-[9px] font-black uppercase tracking-widest",
                config.color,
              )}
            >
              {config.label}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: t("web:table.training.columns.description.label"),
        cell: ({ getValue }) => (
          <TextTruncatedCell
            text={getValue() || "—"}
            className="text-xs text-zinc-500 group-hover:text-zinc-400"
          />
        ),
      }),
      columnHelper.accessor("imageUrl", {
        header: t("web:table.training.columns.imageUrl.label"),
        cell: ({ row }) => (
          <div className="relative h-10 w-16 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:border-amber-400/40">
            <ImageCell
              src={row.original.imageUrl ?? ""}
              alt="Image"
              className="object-cover opacity-70 group-hover:opacity-100"
            />
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("web:table.training.columns.createdAt.label"),
        cell: ({ getValue }) => (
          <DateCell
            date={getValue()}
            dateFormat={DATE_FORMATS.DATE}
            className="font-mono text-[10px] text-zinc-600"
          />
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: t("web:table.training.columns.updatedAt.label"),
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
          <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
            <ActionButtonsCell
              onEdit={() => {
                setTrainingToEdit(row.original);
                setOpenEditDialog(true);
              }}
              onDelete={() => {
                setTrainingToDelete(row.original);
                setOpenDeleteDialog(true);
              }}
            >
              <UpdateTrainingStatusSelect
                currentValue={row.original.status}
                userRole={userRole}
                onValueChange={(value) => {
                  setTrainingToUpdateStatus(row.original);
                  setTrainingNewStatus(value);
                  setOpenWarningDialog(true);
                }}
              />
            </ActionButtonsCell>
          </div>
        ),
      }),
    ],
    [t, userRole],
  );

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
      <UpdateStatusDialog
        training={trainingToUpdateStatus}
        newStatus={trainingNewStatus}
        open={openWarningDialog}
        onOpenChange={setOpenWarningDialog}
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
                className="group cursor-pointer transition-all duration-200 hover:bg-amber-400/[0.03]"
                onClick={() => router.push(`/dashboard/training/${row.original.id}`)}
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
            {trainings.length === 0 && <NoDataFoundRow colSpan={columns.length} />}
          </tbody>
        </table>
      </div>
    </>
  );
};
