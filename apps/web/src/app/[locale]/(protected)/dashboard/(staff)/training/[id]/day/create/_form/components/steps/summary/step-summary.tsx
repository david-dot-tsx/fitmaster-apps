import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { StepsNavigation } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/steps-navigation";
import {
  storedTrainingDayCreateInputSchema,
  useDayCreatorStore,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/store/day-creator.store";
import { useTRPC } from "@/lib/trpc/client";
import { SummaryContainer } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/summary-container";
import { Stepper } from "@/components/stepper";
import {
  DAY_CREATOR_STEPS,
  formStepperSteps,
} from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { StepHeader } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/step-header";
import { LoadingState } from "@/components/query/loading-state";
import { ErrorState } from "@/components/query/error-state";

export const StepSummary = ({ trainingId }: { trainingId: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getStepIterator, isLastStep, getTrainingDayCreateInput, resetStore } =
    useDayCreatorStore();

  const {
    data: training,
    status: trainingStatus,
    error: trainingError,
    refetch: refetchTraining,
  } = useQuery(trpc.training.getById.queryOptions({ id: trainingId }));
  const {
    data: exercises,
    status: exercisesStatus,
    error: exercisesError,
    refetch: refetchExercises,
  } = useQuery(trpc.exercise.list.queryOptions());

  const createTrainingDayMutation = useMutation(
    trpc.trainingDay.create.mutationOptions({
      onSuccess: () => {
        toast.success("Training day created!");
        resetStore();
        queryClient.invalidateQueries(
          trpc.trainingDay.getTrainingsDays.queryOptions({ trainingId }),
        );
        router.push(`/dashboard/training/${trainingId}`);
      },
    }),
  );

  const trainingDayCreateInput = getTrainingDayCreateInput();
  const methods = useForm({
    resolver: zodResolver(storedTrainingDayCreateInputSchema),
    values: trainingDayCreateInput,
  });

  const stepIterator = getStepIterator();

  if (trainingStatus === "pending" || exercisesStatus === "pending") {
    return <LoadingState message="Loading summary…" />;
  }
  if (trainingStatus === "error" || exercisesStatus === "error") {
    return (
      <ErrorState
        title="Failed to load summary data"
        onTryAgain={() => {
          if (trainingError) void refetchTraining();
          if (exercisesError) void refetchExercises();
        }}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        currentStep={DAY_CREATOR_STEPS.SUMMARY}
        steps={formStepperSteps}
        className="w-full"
      />
      <StepHeader step={DAY_CREATOR_STEPS.SUMMARY} />
      <SummaryContainer
        trainingDayCreateInput={trainingDayCreateInput}
        training={training}
        exercises={exercises}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((trainingDayCreateInput) =>
            createTrainingDayMutation.mutate({ ...trainingDayCreateInput, trainingId }),
          )}
        >
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
