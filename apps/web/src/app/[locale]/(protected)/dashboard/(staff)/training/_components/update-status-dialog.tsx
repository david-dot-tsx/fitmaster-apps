"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpDown, Check } from "lucide-react";
import { map } from "remeda";
import { Trans } from "react-i18next";

import {
  TRAINER_TRAINING_STATUS_FLOW,
  TrainingStatus,
  type Training,
  type Role,
  canChangeStatus,
} from "@repo/validators";
import { getTKey } from "@repo/i18n/web";

import { WarningDialog, type WarningDialogProps } from "@/components/warning-dialog";
import { useTRPC } from "@/lib/trpc/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/i18n";
import { useApiErrorTranslatedMessage } from "@/hooks/use-api-error-translated-message";

interface UpdateStatusDialogProps extends Pick<WarningDialogProps, "open" | "onOpenChange"> {
  training: Training | null;
  newStatus: TrainingStatus | null;
}

const statusChangeConsequencesDescription = (newStatus: TrainingStatus) => {
  switch (newStatus) {
    case TrainingStatus.READY_TO_PUBLISH:
      return getTKey("web:dialog.training.updateStatus.description.readyToPublish");
    case TrainingStatus.PUBLISHED:
      return getTKey("web:dialog.training.updateStatus.description.published");
    case TrainingStatus.DISABLED:
      return getTKey("web:dialog.training.updateStatus.description.disabled");
    case TrainingStatus.HIDDEN:
      return getTKey("web:dialog.training.updateStatus.description.hidden");
    case TrainingStatus.DRAFT:
      return getTKey("web:dialog.training.updateStatus.description.draft");
  }
};

export const UpdateStatusDialog = ({
  training,
  newStatus,
  open,
  onOpenChange,
}: UpdateStatusDialogProps) => {
  const { t } = useT();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { getApiErrorTranslatedMessage } = useApiErrorTranslatedMessage();
  const updateStatusMutation = useMutation(
    trpc.training.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success(t("success.generic.description"));
        onOpenChange(false);
        queryClient.invalidateQueries({
          queryKey: trpc.training.listStaff.queryKey(),
        });
      },
      onError: (error) => {
        getApiErrorTranslatedMessage(error.message, {
          default: (translatedMessage: string) => {
            toast.error(translatedMessage);
          },
        });
      },
    }),
  );
  if (!training || !newStatus) return null;

  return (
    <WarningDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {
        if (training?.id) {
          updateStatusMutation.mutate({ trainingId: training.id, status: newStatus });
        }
      }}
      description={
        <>
          <Trans
            i18nKey="web:dialog.training.updateStatus.description.paragraphTrans"
            t={t}
            values={{
              trainingName: training?.name,
              fromStatus: training?.status,
              toStatus: newStatus,
            }}
            components={{
              1: <span className="text-sm font-black italic text-zinc-300" />,
              2: <span className="text-sm font-black tracking-wide text-amber-400" />,
              3: <span className="text-sm font-black text-amber-500" />,
            }}
          />
          {newStatus && (
            <>
              <span className="mt-4 block"></span>
              <span className="italic">{t(statusChangeConsequencesDescription(newStatus))}</span>
              <span className="mt-4 block"></span>
              <span>
                {" "}
                {t("web:dialog.training.updateStatus.description.availableActions")}:{" "}
                <span className="flex flex-col pt-2">
                  {TRAINER_TRAINING_STATUS_FLOW["PUBLISHED"].map((status) => (
                    <span
                      key={status}
                      className="ml-2 flex flex-row items-center gap-2 italic text-zinc-400"
                    >
                      <Check className="size-4 text-zinc-500" />
                      {status}
                    </span>
                  ))}
                </span>
              </span>
            </>
          )}
        </>
      }
    />
  );
};

interface UpdateTrainingStatusSelectProps {
  currentValue: TrainingStatus;
  onValueChange: (value: TrainingStatus) => void;
  userRole: Role;
}
export const UpdateTrainingStatusSelect = ({
  currentValue,
  onValueChange,
  userRole,
}: UpdateTrainingStatusSelectProps) => {
  const { t } = useT();

  return (
    <Select value={currentValue} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={t("web:dialog.training.updateStatus.select.ariaLabel")}
        title={t("web:dialog.training.updateStatus.select.title")}
        className={cn(
          "size-8 justify-center border border-zinc-800 bg-zinc-900/50 p-0 text-zinc-400 backdrop-blur-sm transition-all duration-200",
          "hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400",
          "focus:ring-0 focus:ring-offset-0",
          "[&>svg:last-child]:hidden",
        )}
      >
        <span className="sr-only">
          <SelectValue placeholder={currentValue} />
        </span>
        <ArrowUpDown className="size-3.5" />
      </SelectTrigger>
      <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
        {map(Object.values(TrainingStatus), (trainingStatus) => (
          <SelectItem
            key={trainingStatus}
            value={trainingStatus}
            disabled={
              trainingStatus === currentValue ||
              !canChangeStatus(currentValue, trainingStatus, userRole)
            }
            className="text-xs font-black uppercase tracking-widest text-zinc-300 focus:bg-amber-400/10 focus:text-amber-300"
          >
            {trainingStatus}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
