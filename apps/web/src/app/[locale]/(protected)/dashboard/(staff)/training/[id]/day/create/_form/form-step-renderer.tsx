import { useMemo } from "react";

import { StepSummary } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/step-summary";
import { DAY_CREATOR_STEPS } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { useDayCreatorStore } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";
import { StepCoolDown } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/cool-down/step-cool-down";
import { StepMainWorkout } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/main-workout/step-main-workout";
import { StepWarmUp } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/warm-up/step-warm-up";

export const FormStepRenderer = ({ trainingId }: { trainingId: string }) => {
  const { currentStep } = useDayCreatorStore();

  const content = useMemo(() => {
    switch (currentStep) {
      case DAY_CREATOR_STEPS.WARM_UP:
        return <StepWarmUp />;
      case DAY_CREATOR_STEPS.MAIN_WORKOUT:
        return <StepMainWorkout />;
      case DAY_CREATOR_STEPS.COOL_DOWN:
        return <StepCoolDown />;
      case DAY_CREATOR_STEPS.SUMMARY:
        return <StepSummary trainingId={trainingId} />;
      default:
        return null;
    }
  }, [currentStep, trainingId]);

  return content;
};
