"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

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
import { useT } from "@/lib/i18n/i18n";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

export const CreateTrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const trpc = useTRPC();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const methods = useForm<TrainingCreateInputForm>({
    resolver: zodResolver(trainingCreateInputFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "https://picsum.photos/id/280/1024/1024",
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
        toast.success(t("success.generic.description"));
        onOpenChange(false);
      },
      onError: (error) => {
        handleApiErrorMessage(error.message, {
          default: (translatedMessage: string) => {
            toast.error(translatedMessage);
            onOpenChange(false);
          },
        });
      },
    }),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormProvider {...methods}>
        <DialogTrigger asChild>
          <Button className="bg-amber-400 font-black uppercase tracking-widest text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-amber-500">
            <PlusIcon className="mr-2 size-4 stroke-[3px]" />
            {t("web:dialog.training.create.button")}
          </Button>
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[525px]">
          <form onSubmit={methods.handleSubmit((data) => createTrainingMutation.mutate(data))}>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                  {t("web:dialog.training.create.title.new")}{" "}
                  <span className="text-amber-400">
                    {t("web:dialog.training.create.title.training")}
                  </span>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t("web:dialog.training.create.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="my-8 space-y-6">
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* Full width Name */}
                <div className="col-span-2">
                  <FormInput
                    name="name"
                    label={t("web:dialog.training.create.form.name.label")}
                    placeholder={t("web:dialog.training.create.form.name.placeholder")}
                  />
                </div>

                {/* Description & URL */}
                <div className="col-span-2 space-y-4">
                  <FormInput
                    name="description"
                    label={t("web:dialog.training.create.form.description.label")}
                    placeholder={t("web:dialog.training.create.form.description.placeholder")}
                  />
                  <FormInput
                    name="imageUrl"
                    label={t("web:dialog.training.create.form.imageUrl.label")}
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
                {t("create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
