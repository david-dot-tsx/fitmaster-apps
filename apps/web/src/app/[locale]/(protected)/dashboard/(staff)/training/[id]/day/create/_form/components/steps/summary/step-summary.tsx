import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { trainingDayCreateInputSchema } from "@repo/validators";

import { StepsNavigation } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/steps-navigation";
import { useDayCreatorStore } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";
import { useTRPC } from "@/lib/trpc/client";
import { SummaryContainer } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/summary-container";
import { Stepper } from "@/components/stepper";
import {
  DAY_CREATOR_STEPS,
  formStepperSteps,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { StepHeader } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/step-header";

export const StepSummary = () => {
  const trpc = useTRPC();

  const { getStepIterator, isLastStep, getTrainingDayCreateInput, resetStore, trainingId } =
    useDayCreatorStore();

  const { data: training } = useQuery(trpc.training.getById.queryOptions({ id: trainingId }));
  const { data: exercises } = useQuery(trpc.exercise.list.queryOptions());

  const createTrainingDayMutation = useMutation(
    trpc.trainingDay.create.mutationOptions({
      onSuccess: () => {
        toast.success("Training day created!");
        resetStore();
      },
    }),
  );

  const data = getTrainingDayCreateInput();
  const methods = useForm({
    resolver: zodResolver(trainingDayCreateInputSchema),
    values: data,
  });

  const stepIterator = getStepIterator();

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        currentStep={DAY_CREATOR_STEPS.SUMMARY}
        steps={formStepperSteps}
        className="w-full"
      />
      <StepHeader step={DAY_CREATOR_STEPS.SUMMARY} />
      <SummaryContainer trainingDayData={data} training={training} exercises={exercises} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => createTrainingDayMutation.mutate(data))}>
          <StepsNavigation
            handlePrevious={stepIterator.previous}
            isLastStep={isLastStep()}
            className="mt-4"
          />
        </form>
      </FormProvider>
    </div>
  );
};
