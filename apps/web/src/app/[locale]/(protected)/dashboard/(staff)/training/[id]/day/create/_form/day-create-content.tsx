"use client";

import { Zap, Flame, Snowflake, ListCheck } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { FormStepRenderer } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/form-step-renderer";
import { DAY_CREATOR_STEPS } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";

export const stepConfig = {
  [DAY_CREATOR_STEPS.WARM_UP]: {
    label: "Warm up Section",
    icon: <Zap className="size-8 text-amber-400" />,
    description: "Prepare your body for the workout and increase the muscle temperature.",
    accent: "bg-amber-400",
  },
  [DAY_CREATOR_STEPS.MAIN_WORKOUT]: {
    label: "Main Workout",
    icon: <Flame className="size-8 text-amber-500" />,
    description: "Main part of the workout - focus on technique and intensity.",
    accent: "bg-amber-500",
  },
  [DAY_CREATOR_STEPS.COOL_DOWN]: {
    label: "Cool Down",
    icon: <Snowflake className="size-8 text-blue-400" />,
    description: "Relax your heart and take care of post-workout recovery.",
    accent: "bg-blue-400",
  },
  [DAY_CREATOR_STEPS.SUMMARY]: {
    label: "Summary",
    icon: <ListCheck className="size-8 text-green-400" />,
    description: "Summary of the workout and performed exercises.",
    accent: "bg-green-400",
  },
} as const;

export const DayCreateContent = () => {
  return (
    <PageWrapper title="Training day creator">
      <div className="flex w-full flex-col gap-4">
        <FormStepRenderer />
      </div>
    </PageWrapper>
  );
};
