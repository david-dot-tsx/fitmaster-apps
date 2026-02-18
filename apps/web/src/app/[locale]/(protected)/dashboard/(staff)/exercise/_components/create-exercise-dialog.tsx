"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type ExerciseCreateInputForm,
  exerciseCreateInputFormSchema,
  exerciseCreateInputSchema,
  BodyPart,
  Difficulty,
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
  DialogTrigger,
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

// TODO: move to a separate file, create use the same options for the create form
const bodyPartOptions = [
  { children: "Chest", value: BodyPart.CHEST },
  { children: "Back", value: BodyPart.BACK },
  { children: "Legs", value: BodyPart.LEGS },
  { children: "Shoulders", value: BodyPart.SHOULDERS },
];

export const CreateExerciseDialog = () => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const methods = useForm<ExerciseCreateInputForm>({
    resolver: zodResolver(exerciseCreateInputFormSchema),
    defaultValues: {
      name: "",
      difficulty: null,
      bodyPart: null,
      description: "",
      imageUrl: "https://picsum.photos/id/260/1024/1024",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      methods.reset();
    }
    setOpen(open);
  };

  const createExerciseMutation = useMutation(
    trpc.exercise.create.mutationOptions({
      onSuccess: () => {
        toast.success("Exercise created!");
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to create exercise");
        console.error(error);
      },
    }),
  );

  const submitForm = (data: ExerciseCreateInputForm) => {
    const parsedData = exerciseCreateInputSchema.parse(data);
    createExerciseMutation.mutate(parsedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider {...methods}>
        <DialogTrigger asChild>
          <Button>Create Exercise</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader>
              <DialogTitle>Create Exercise</DialogTitle>
              <DialogDescription>
                Create a new exercise here. Click save when you&apos;re done.
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
