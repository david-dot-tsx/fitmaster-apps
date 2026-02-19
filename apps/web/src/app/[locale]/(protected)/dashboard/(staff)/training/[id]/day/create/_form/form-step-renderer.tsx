import { useMemo } from "react";

import { StepSummary } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/step-summary";
import { DAY_CREATOR_STEPS } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { useDayCreatorStore } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";
import { StepExerciseBlockForm } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/step-exercise-block-form";

export const FormStepRenderer = ({ trainingId }: { trainingId: string }) => {
  const { currentStep } = useDayCreatorStore();

  const content = useMemo(() => {
    if (currentStep === DAY_CREATOR_STEPS.SUMMARY) {
      return <StepSummary trainingId={trainingId} />;
    }

    return <StepExerciseBlockForm key={currentStep} />;
  }, [currentStep, trainingId]);

  return content;
};
