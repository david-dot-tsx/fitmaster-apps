"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Difficulty,
  BodyPart,
  exerciseUpdateInputSchema,
  type ExerciseUpdateInputForm,
  exerciseUpdateInputFormSchema,
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

export const ExerciseEditForm = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data } = useQuery(trpc.exercise.getById.queryOptions({ id }));
  const methods = useForm<ExerciseUpdateInputForm>({
    resolver: zodResolver(exerciseUpdateInputFormSchema),
    values: {
      name: data?.name ?? "",
      difficulty: data?.difficulty ?? null,
      bodyPart: data?.bodyPart ?? null,
      description: data?.description ?? "",
      imageUrl: data?.imageUrl ?? "",
      id,
    },
  });

  const editExerciseMutation = useMutation(
    trpc.exercise.update.mutationOptions({
      onSuccess: () => {
        alert("Exercise updated!");
        router.push(`/dashboard/exercise/${id}`);
      },
    }),
  );

  const submitForm = (data: ExerciseUpdateInputForm) => {
    const parsedData = exerciseUpdateInputSchema.parse(data);
    editExerciseMutation.mutate(parsedData);
  };
  if (editExerciseMutation.error) {
    console.error(editExerciseMutation.error);
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
          Update
        </Button>
      </form>
    </FormProvider>
  );
};
