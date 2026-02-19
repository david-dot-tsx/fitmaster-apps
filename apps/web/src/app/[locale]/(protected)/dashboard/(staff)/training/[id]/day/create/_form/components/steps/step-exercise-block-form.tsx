import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  workoutBlockCoolDownSchema,
  workoutBlockMainWorkoutSchema,
  workoutBlockWarmUpSchema,
  type WorkoutCreateBlockBase,
} from "@repo/validators";

import { Stepper } from "@/components/stepper";
import {
  DAY_CREATOR_STEPS,
  type DayCreatorStep,
  formStepperSteps,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { StepsNavigation } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/steps-navigation";
import { StepHeader } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/step-header";
import { WorkoutBlock } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/workout-block/workout-block";
import { useDayCreatorStore } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";

const getCurrentStepSchema = (step: DayCreatorStep) => {
  switch (step) {
    case DAY_CREATOR_STEPS.WARM_UP:
      return workoutBlockWarmUpSchema;
    case DAY_CREATOR_STEPS.MAIN_WORKOUT:
      return workoutBlockMainWorkoutSchema;
    case DAY_CREATOR_STEPS.COOL_DOWN:
      return workoutBlockCoolDownSchema;
    default:
      throw new Error(`Unknown step: ${step}`);
  }
};

export const StepExerciseBlockForm = () => {
  const { getStepIterator, isLastStep, saveCurrentStepData, getCurrentStepData, currentStep } =
    useDayCreatorStore();
  const stepIterator = getStepIterator();
  const schema = getCurrentStepSchema(currentStep);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: getCurrentStepData(),
  });

  const onSubmit = (data: WorkoutCreateBlockBase) => {
    saveCurrentStepData(data);
    stepIterator.next?.();
  };

  useEffect(() => {
    if (
      methods.formState.errors.exercises?.type === "too_small" ||
      methods.formState.errors.exercises?.root?.type === "too_small"
    ) {
      const msg =
        methods.formState.errors.exercises?.message ||
        methods.formState.errors.exercises?.root?.message;
      toast.error(msg);
    }
  }, [methods.formState.errors.exercises]);

  return (
    <FormProvider {...methods}>
      <form className="flex w-full flex-col gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stepper currentStep={currentStep} steps={formStepperSteps} className="w-full" />
        <StepHeader step={currentStep} />
        <WorkoutBlock />
        <StepsNavigation
          handlePrevious={stepIterator.previous}
          isLastStep={isLastStep()}
          className="mt-4"
        />
      </form>
    </FormProvider>
  );
};
