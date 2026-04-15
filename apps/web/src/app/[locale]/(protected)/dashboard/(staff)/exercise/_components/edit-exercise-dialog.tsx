"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Trans } from "react-i18next";

import {
  BodyPart,
  Difficulty,
  type ExerciseUpdateInputForm,
  exerciseUpdateInputFormSchema,
  exerciseUpdateInputSchema,
} from "@repo/validators";

import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/form/form-input";
import { useTRPC } from "@/lib/trpc/client";
import { FormSelect } from "@/components/form/form-select";
import { useT } from "@/lib/i18n/i18n";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

// TODO: move to a separate file, create use the same options for the create form, take into account i18n
const difficultyOptions = [
  { children: "Easy", value: Difficulty.EASY },
  { children: "Medium", value: Difficulty.MEDIUM },
  { children: "Hard", value: Difficulty.HARD },
];

// TODO: move to a separate file, create use the same options for the create form, take into account i18n
const bodyPartOptions = [
  { children: "Chest", value: BodyPart.CHEST },
  { children: "Back", value: BodyPart.BACK },
  { children: "Legs", value: BodyPart.LEGS },
  { children: "Shoulders", value: BodyPart.SHOULDERS },
];

interface EditExerciseDialogProps extends Pick<DialogProps, "open" | "onOpenChange"> {
  exercise: ExerciseUpdateInputForm | null;
  onSuccess?: () => void;
}

export const EditExerciseDialog = ({
  exercise,
  open,
  onOpenChange,
  onSuccess,
}: EditExerciseDialogProps) => {
  const { t } = useT();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const methods = useForm<ExerciseUpdateInputForm>({
    resolver: zodResolver(exerciseUpdateInputFormSchema),
    values: exercise ?? undefined,
  });

  const editExerciseMutation = useMutation(
    trpc.exercise.update.mutationOptions({
      onSuccess: () => {
        toast.success(t("success.generic.description"));
        onOpenChange?.(false);
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
        queryClient.invalidateQueries(
          trpc.exercise.getById.queryOptions({ id: exercise?.id ?? "" }),
        );
        onSuccess?.();
      },
      onError: (error) => {
        handleApiErrorMessage(error.message, {
          default: (translatedMessage: string) => {
            toast.error(translatedMessage);
            onOpenChange?.(false);
          },
        });
      },
    }),
  );

  const submitForm = (data: ExerciseUpdateInputForm) => {
    const parsedData = exerciseUpdateInputSchema.parse(data);
    editExerciseMutation.mutate(parsedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider {...methods}>
        <DialogContent className="border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[525px]">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <DialogTitle className="text-2xl font-black uppercase italic tracking-wider text-zinc-100">
                  <Trans
                    i18nKey="web:dialog.exercise.edit.title.editExerciseTrans"
                    t={t}
                    values={{
                      exerciseName: exercise?.name,
                    }}
                    components={{
                      1: <span className="text-amber-400" />,
                    }}
                  />
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t("web:dialog.exercise.edit.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="my-8 space-y-6">
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* Full width Name */}
                <div className="col-span-2">
                  <FormInput
                    name="name"
                    label={t("web:dialog.exercise.edit.form.exerciseName.label")}
                  />
                </div>

                {/* Row for selects */}
                <FormSelect
                  name="difficulty"
                  label={t("web:dialog.exercise.edit.form.difficulty.label")}
                  options={difficultyOptions}
                />
                <FormSelect
                  name="bodyPart"
                  label={t("web:dialog.exercise.edit.form.bodyPart.label")}
                  options={bodyPartOptions}
                />

                {/* Description & URL */}
                <div className="col-span-2 space-y-4">
                  <FormInput
                    name="description"
                    label={t("web:dialog.exercise.edit.form.description.label")}
                  />
                  <FormInput
                    name="imageUrl"
                    label={t("web:dialog.exercise.edit.form.imageUrl.label")}
                  />
                </div>
              </FieldGroup>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                >
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-amber-400 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all hover:bg-amber-500 active:scale-95"
              >
                {t("update")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
