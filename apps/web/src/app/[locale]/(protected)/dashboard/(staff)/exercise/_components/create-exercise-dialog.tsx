"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

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
          <Button className="bg-amber-400 font-black uppercase tracking-widest text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-amber-500">
            <PlusIcon className="mr-2 size-4 stroke-[3px]" />
            New Exercise
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[525px]">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                  New <span className="text-amber-400">Exercise</span>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Insert the parameters of the new exercise.
              </DialogDescription>
            </DialogHeader>

            <div className="my-8 space-y-6">
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* Full width Name */}
                <div className="col-span-2">
                  <FormInput name="name" label="Exercise Identity" placeholder="e.g. Bench Press" />
                </div>

                {/* Row for selects */}
                <FormSelect name="difficulty" label="Intensity Level" options={difficultyOptions} />
                <FormSelect name="bodyPart" label="Target Anatomy" options={bodyPartOptions} />

                {/* Description & URL */}
                <div className="col-span-2 space-y-4">
                  <FormInput name="description" label="Details" />
                  <FormInput name="imageUrl" label="Visual Asset (URL)" />
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
                  Abort
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-amber-400 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all hover:bg-amber-500 active:scale-95"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
