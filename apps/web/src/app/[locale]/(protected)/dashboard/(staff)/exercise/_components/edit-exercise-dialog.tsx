"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import {
  BodyPart,
  Difficulty,
  type ExerciseUpdateInputForm,
  exerciseUpdateInputFormSchema,
  exerciseUpdateInputSchema,
} from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/web";

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
import { useTranslation } from "@/lib/i18n/i18n";

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
}

export const EditExerciseDialog = ({ exercise, open, onOpenChange }: EditExerciseDialogProps) => {
  const { t } = useTranslation([NAMESPACES.WEB]);
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
      },
      onError: (error) => {
        toast.error(t("errors.generic.description"));
        console.error(error);
        onOpenChange?.(false);
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
                  {t("web:dialog.exercise.edit.title.editExercise")}{" "}
                  <span className="text-amber-400">{exercise?.name}</span>
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
