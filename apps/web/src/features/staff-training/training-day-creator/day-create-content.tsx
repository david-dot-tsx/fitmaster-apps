"use client";

import { Zap, Flame, Snowflake, ListCheck } from "lucide-react";
import { type ResourceKey } from "i18next";

import { getTKey } from "@repo/i18n/web";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { FormStepRenderer } from "@/features/staff-training/training-day-creator/form-step-renderer";
import {
  DAY_CREATOR_STEPS,
  type DayCreatorStepKey,
} from "@/features/staff-training/training-day-creator/consts/steps";
import { useT } from "@/lib/i18n/i18n";

export const stepConfig: Record<
  DayCreatorStepKey,
  { label: ResourceKey; icon: React.ReactNode; description: ResourceKey; accent: string }
> = {
  [DAY_CREATOR_STEPS.WARM_UP]: {
    label: getTKey("web:pages.trainingDayCreator.stepper.warmUp.label"),
    icon: <Zap className="size-8 text-amber-400" />,
    description: getTKey("web:pages.trainingDayCreator.stepper.warmUp.description"),
    accent: "bg-amber-400",
  },
  [DAY_CREATOR_STEPS.MAIN_WORKOUT]: {
    label: getTKey("web:pages.trainingDayCreator.stepper.mainWorkout.label"),
    icon: <Flame className="size-8 text-amber-500" />,
    description: getTKey("web:pages.trainingDayCreator.stepper.mainWorkout.description"),
    accent: "bg-amber-500",
  },
  [DAY_CREATOR_STEPS.COOL_DOWN]: {
    label: getTKey("web:pages.trainingDayCreator.stepper.coolDown.label"),
    icon: <Snowflake className="size-8 text-blue-400" />,
    description: getTKey("web:pages.trainingDayCreator.stepper.coolDown.description"),
    accent: "bg-blue-400",
  },
  [DAY_CREATOR_STEPS.SUMMARY]: {
    label: getTKey("web:pages.trainingDayCreator.stepper.summary.label"),
    icon: <ListCheck className="size-8 text-green-400" />,
    description: getTKey("web:pages.trainingDayCreator.stepper.summary.description"),
    accent: "bg-green-400",
  },
} as const;

export const DayCreateContent = ({ trainingId }: { trainingId: string }) => {
  const { t } = useT();

  return (
    <PageWrapper
      title={t("web:pages.trainingDayCreator.title")}
      subtitle={t("web:pages.trainingDayCreator.subtitle")}
      eyebrow={t("web:pages.trainingDayCreator.eyebrow")}
    >
      <div className="flex w-full flex-col gap-4">
        <FormStepRenderer trainingId={trainingId} />
      </div>
    </PageWrapper>
  );
};
