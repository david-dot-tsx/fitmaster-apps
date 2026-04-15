"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { type ExerciseBaseWithId } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { ActionButtonsCell } from "@/components/table/cells/action-buttons-cell";
import { DeleteDialog } from "@/components/delete-dialog";
import { EditExerciseDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/_components/edit-exercise-dialog";
import { useT } from "@/lib/i18n/i18n";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

interface ExerciseActionsProps {
  exercise: ExerciseBaseWithId;
}
export const ExerciseActions = ({ exercise }: ExerciseActionsProps) => {
  const { t } = useT();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseBaseWithId | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<ExerciseBaseWithId | null>(null);

  const { mutate: deleteExercise, status: deleteStatus } = useMutation(
    trpc.exercise.delete.mutationOptions({
      onSuccess: () => {
        toast.success(t("success.generic.description"));
        setOpenDeleteDialog(false);
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
        router.push("/dashboard/exercise");
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

  return (
    <>
      <div>
        <ActionButtonsCell
          onDelete={() => {
            setOpenDeleteDialog(true);
            setExerciseToDelete(exercise);
          }}
          onEdit={() => {
            setExerciseToEdit(exercise);
            setOpenEditDialog(true);
          }}
        />
      </div>
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
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
};
