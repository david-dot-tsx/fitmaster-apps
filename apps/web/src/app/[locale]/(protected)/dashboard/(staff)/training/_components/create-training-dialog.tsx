"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { trainingCreateInputFormSchema, type TrainingCreateInputForm } from "@repo/validators";

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

export const CreateTrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const methods = useForm<TrainingCreateInputForm>({
    resolver: zodResolver(trainingCreateInputFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      methods.reset();
    }
    setOpen(open);
  };

  const createTrainingMutation = useMutation(
    trpc.training.create.mutationOptions({
      onSuccess: () => {
        alert("Training created!");
        onOpenChange(false);
      },
      onError: (error) => {
        console.error(error);
        onOpenChange(false);
      },
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider {...methods}>
        <DialogTrigger asChild>
          <Button>Create Training</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={methods.handleSubmit((data) => createTrainingMutation.mutate(data))}>
            <DialogHeader>
              <DialogTitle>Create Training</DialogTitle>
              <DialogDescription>
                Create a new training here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="my-4">
              <FormInput name="name" label="Name" />
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
