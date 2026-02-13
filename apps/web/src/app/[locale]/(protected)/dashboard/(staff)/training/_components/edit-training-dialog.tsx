"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DialogProps } from "@radix-ui/react-dialog";

import {
  type Training,
  TrainingStatus,
  type TrainingUpdateInputForm,
  trainingUpdateInputFormSchema,
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

interface EditTrainingDialogProps extends Pick<DialogProps, "open" | "onOpenChange"> {
  training: Training | null;
}
export const EditTrainingDialog = ({ training, open, onOpenChange }: EditTrainingDialogProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const methods = useForm<TrainingUpdateInputForm>({
    resolver: zodResolver(trainingUpdateInputFormSchema),
    values: training ?? undefined,
  });

  const editTrainingMutation = useMutation(
    trpc.training.update.mutationOptions({
      onSuccess: () => {
        alert("Training updated!");
        onOpenChange?.(false);
        queryClient.invalidateQueries(
          trpc.training.listStaff.queryOptions({
            status: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        onOpenChange?.(false);
      },
    }),
  );

  const submitForm = (data: TrainingUpdateInputForm) => {
    if (!training?.id) return;

    editTrainingMutation.mutate({ id: training?.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader>
              <DialogTitle>Edit Training</DialogTitle>
              <DialogDescription>
                Edit the training here. Click save when you&apos;re done.
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
