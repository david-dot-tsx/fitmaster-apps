import { useMemo } from "react";

import { StepSummary } from "@/features/staff-training/training-day-creator/components/steps/summary/step-summary";
import { DAY_CREATOR_STEPS } from "@/features/staff-training/training-day-creator/consts/steps";
import { useDayCreatorStore } from "@/features/staff-training/training-day-creator/store/day-creator.store";
import { StepExerciseBlockForm } from "@/features/staff-training/training-day-creator/components/steps/step-exercise-block-form";

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
