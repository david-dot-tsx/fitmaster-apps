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
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const methods = useForm<ExerciseUpdateInputForm>({
    resolver: zodResolver(exerciseUpdateInputFormSchema),
    values: exercise ?? undefined,
  });

  const editExerciseMutation = useMutation(
    trpc.exercise.update.mutationOptions({
      onSuccess: () => {
        toast.success("Exercise updated!");
        onOpenChange?.(false);
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
      },
      onError: (error) => {
        toast.error("Failed to update exercise");
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
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader>
              <DialogTitle>Edit Exercise</DialogTitle>
              <DialogDescription>
                Edit the exercise here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="my-4">
              <FormInput name="name" label="Name" />
              <FormSelect name="difficulty" label="Difficulty" options={difficultyOptions} />
              <FormSelect name="bodyPart" label="Body Part" options={bodyPartOptions} />
              <FormInput name="description" label="Description" />
              <FormInput name="imageUrl" label="Image URL" />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
