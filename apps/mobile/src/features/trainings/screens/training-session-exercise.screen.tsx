import React from "react";
import { router } from "expo-router";

import { WorkoutExerciseSessionStatus } from "@repo/validators";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TrainingHero } from "@/features/trainings/components/training-hero";
import { TraitList } from "@/features/trainings/components/session-exercise/exercise-trait-list";
import { StopWatch, useStopWatch } from "@/components/stop-watch";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import { VStack } from "@/components/ui/vstack";

//
/**
 * TODO:
 * - Handle internet connetion troubles, save local time spent in the exercise and send it when the internet is back.
 * - fillup fileds with prefix actual to track user progress
 */

export const TrainingSessionExerciseScreen = ({
  trainingId,
  sessionId,
}: {
  trainingId: string;
  sessionId: string;
}) => {
  const stopWatchProps = useStopWatch();
  const utils = trpc.useUtils();

  const { data } = trpc.training.session.getCurrentExercise.useQuery({
    trainingSessionId: sessionId,
  });

  const isLastExercise = data?.exercisesLeftAmount === 0;

  const { mutate: startExercise } = trpc.training.session.startExercise.useMutation({
    onSuccess: () => {
      if (!stopWatchProps.running) {
        stopWatchProps.toggleStopWatch();
      }
      utils.training.session.getCurrentExercise.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: completeExercise } = trpc.training.session.completeExercise.useMutation({
    onSuccess: () => {
      utils.training.session.getCurrentExercise.invalidate();
      if (isLastExercise) {
        router.push(`/training/${trainingId}/session/${sessionId}/finished`);
      }
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      stopWatchProps.resetStopWatch();
    },
  });

  return (
    <ScreenWrapper>
      <TrainingHero imageUrl={data?.currentExercise?.workoutExercise?.exercise.imageUrl ?? null} />
      <VStack className="flex-1 gap-4">
        <Heading size="2xl" className="font-black uppercase italic tracking-tighter text-amber-400">
          {data?.currentExercise?.workoutExercise?.exercise.name}
        </Heading>
        <HStack className="items-center justify-between">
          <ExerciseProgress
            exercisesLeftAmount={data?.exercisesLeftAmount}
            totalExercisesAmount={data?.totalExercisesAmount}
            currentExerciseStatus={data?.currentExercise?.status}
          />
          <Text>
            <Badge size="sm" variant="solid" action="info">
              <BadgeText>{data?.currentExercise?.workoutExercise.workoutBlockType}</BadgeText>
            </Badge>
          </Text>
        </HStack>
        <VStack>
          <Text className="mb-2 text-lg font-bold text-zinc-400">Description</Text>
          <Text>{data?.currentExercise?.workoutExercise?.exercise.description}</Text>
        </VStack>
        <VStack>
          <Text className="mb-2 text-lg font-bold text-zinc-400">Traits</Text>
          {data?.currentExercise && <TraitList sessionExercise={data.currentExercise} />}
        </VStack>
        <VStack className="flex-1">
          <StopWatch
            {...stopWatchProps}
            disabled={data?.currentExercise?.status === WorkoutExerciseSessionStatus.NOT_STARTED}
          />
        </VStack>
      </VStack>
      <Button
        size="lg"
        className="mt-auto bg-amber-400 font-bold tracking-widest text-zinc-950"
        onPress={() => {
          if (data?.currentExercise?.status === WorkoutExerciseSessionStatus.NOT_STARTED) {
            startExercise({
              workoutExerciseSessionId: data?.currentExercise?.id ?? "",
            });
          } else {
            stopWatchProps.setRunning(false);
            completeExercise({
              workoutExerciseSessionId: data?.currentExercise?.id ?? "",
              timeSpentMiliseconds: stopWatchProps.elapsed,
            });
          }
        }}
      >
        <ButtonText>
          {data?.currentExercise?.status === WorkoutExerciseSessionStatus.IN_PROGRESS
            ? "Complete Exercise"
            : "Start Exercise"}
        </ButtonText>
      </Button>
    </ScreenWrapper>
  );
};

const ExerciseProgress = ({
  exercisesLeftAmount,
  totalExercisesAmount,
  currentExerciseStatus,
}: {
  exercisesLeftAmount?: number;
  totalExercisesAmount?: number;
  currentExerciseStatus?: WorkoutExerciseSessionStatus;
}) => {
  if (!exercisesLeftAmount || !totalExercisesAmount) return null;

  return (
    <Text className="text-lg font-bold text-zinc-400">
      {currentExerciseStatus === WorkoutExerciseSessionStatus.NOT_STARTED
        ? totalExercisesAmount - exercisesLeftAmount + 1
        : totalExercisesAmount - exercisesLeftAmount}
      /{totalExercisesAmount}
    </Text>
  );
};
