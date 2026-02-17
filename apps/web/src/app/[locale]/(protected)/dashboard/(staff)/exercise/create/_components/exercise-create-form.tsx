"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Difficulty,
  BodyPart,
  type ExerciseCreateInputForm,
  exerciseCreateInputFormSchema,
  exerciseCreateInputSchema,
} from "@repo/validators";

import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";

// TODO: move to a separate file, create use the same options for the create form
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

export const ExerciseCreateForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
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
  const createExerciseMutation = useMutation(
    trpc.exercise.create.mutationOptions({
      onSuccess: () => {
        alert("Exercise created!");
        router.push("/dashboard/exercise");
        queryClient.invalidateQueries(trpc.exercise.list.queryOptions());
      },
    }),
  );

  const submitForm = (data: ExerciseCreateInputForm) => {
    const parsedData = exerciseCreateInputSchema.parse(data);
    createExerciseMutation.mutate(parsedData);
  };
  if (createExerciseMutation.error) {
    console.error(createExerciseMutation.error);
  }

  return (
    <FormProvider {...methods}>
      <form className="flex w-full flex-col gap-4">
        <FormInput name="name" label="Name" />
        <FormSelect name="difficulty" label="Difficulty" options={difficultyOptions} />
        <FormSelect name="bodyPart" label="Body Part" options={bodyPartOptions} />
        <FormInput name="description" label="Description" />
        <FormInput name="imageUrl" label="Image URL" />
        <Button type="submit" onClick={methods.handleSubmit(submitForm)} className="mt-8">
          Create
        </Button>
      </form>
    </FormProvider>
  );
};
