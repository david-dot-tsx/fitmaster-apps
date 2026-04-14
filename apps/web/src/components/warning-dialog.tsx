"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { type AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { type MutationStatus } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/web";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type WarningDialogProps = Required<Pick<AlertDialogProps, "open" | "onOpenChange">> & {
  onConfirm: () => void;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  status?: MutationStatus;
};

export const WarningDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  status,
}: WarningDialogProps) => {
  const { t } = useTranslation([NAMESPACES.WEB]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-amber-400/20 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[460px]">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-60" />

        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
              <AlertTriangle className="size-5 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]" />
            </div>
            <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter text-zinc-100">
              {title ?? t("web:dialog.warning.title")}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xs font-bold uppercase leading-relaxed tracking-widest text-zinc-500">
            {description ?? t("web:dialog.warning.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
          <AlertDialogCancel className="border-zinc-800 bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
            {cancelLabel ?? t("web:dialog.warning.cancelButton")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            type="submit"
            disabled={status === "pending"}
            className={cn(
              "bg-amber-400 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(251,191,36,0.18)] transition-all hover:bg-amber-500",
              status === "pending" && "cursor-not-allowed opacity-50",
            )}
          >
            {status === "pending" && <Loader2 className="mr-2 size-3 animate-spin" />}
            {confirmLabel ?? t("web:dialog.warning.confirmButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
