"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import {
  type Training,
  TrainingStatus,
  type TrainingUpdateInputForm,
  trainingUpdateInputFormSchema,
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
import { useTranslation } from "@/lib/i18n/i18n";

interface EditTrainingDialogProps extends Pick<DialogProps, "open" | "onOpenChange"> {
  training: Training | null;
}
export const EditTrainingDialog = ({ training, open, onOpenChange }: EditTrainingDialogProps) => {
  const { t } = useTranslation([NAMESPACES.WEB]);
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const methods = useForm<TrainingUpdateInputForm>({
    resolver: zodResolver(trainingUpdateInputFormSchema),
    values: training ?? undefined,
  });

  const editTrainingMutation = useMutation(
    trpc.training.update.mutationOptions({
      onSuccess: () => {
        toast.success(t("success.generic.description"));
        onOpenChange?.(false);
        queryClient.invalidateQueries(
          trpc.training.listStaff.queryOptions({
            status: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
          }),
        );
      },
      onError: (error) => {
        toast.error(t("errors.generic.description"));
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
        <DialogContent className="border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[525px]">
          <form onSubmit={methods.handleSubmit(submitForm)}>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                  {t("web:dialog.training.edit.title.editTraining")}: <br />
                  <span className="text-amber-400">{training?.name}</span>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t("web:dialog.training.edit.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="my-8 space-y-6">
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* Full width Name */}
                <div className="col-span-2">
                  <FormInput
                    name="name"
                    label={t("web:dialog.training.edit.form.name.label")}
                    placeholder={t("web:dialog.training.edit.form.name.placeholder")}
                  />
                </div>

                {/* Description & URL */}
                <div className="col-span-2 space-y-4">
                  <FormInput
                    name="description"
                    label={t("web:dialog.training.edit.form.description.label")}
                    placeholder={t("web:dialog.training.edit.form.description.placeholder")}
                  />
                  <FormInput
                    name="imageUrl"
                    label={t("web:dialog.training.edit.form.imageUrl.label")}
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
