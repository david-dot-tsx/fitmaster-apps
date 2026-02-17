import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { type WorkoutBlockCoolDown, workoutBlockCoolDownSchema } from "@repo/validators";

import { StepsNavigation } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/steps-navigation";
import { Stepper } from "@/components/stepper";
import {
  DAY_CREATOR_STEPS,
  formStepperSteps,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { WorkoutBlock } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/workout-block/workout-block";
import { useDayCreatorStore } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";
import { StepHeader } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/step-header";

export const StepCoolDown = () => {
  const { getStepIterator, isLastStep, saveCurrentStepData, getCurrentStepData } =
    useDayCreatorStore();
  const stepIterator = getStepIterator();
  const methods = useForm({
    resolver: zodResolver(workoutBlockCoolDownSchema),
    defaultValues: getCurrentStepData(),
  });

  const onSubmit = (data: WorkoutBlockCoolDown) => {
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
        <Stepper
          currentStep={DAY_CREATOR_STEPS.COOL_DOWN}
          steps={formStepperSteps}
          className="w-full"
        />
        <StepHeader step={DAY_CREATOR_STEPS.COOL_DOWN} />
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
