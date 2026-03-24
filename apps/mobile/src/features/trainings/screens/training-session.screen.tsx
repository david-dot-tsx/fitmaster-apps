import React, { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TrainingHero } from "@/features/trainings/components/training-hero";
import { TrainingDaySessionPreview } from "@/features/trainings/components/session/training-day-session-preview";

export const TrainingSessionScreen = ({
  trainingId,
  sessionId,
}: {
  trainingId: string;
  sessionId: string;
}) => {
  const { data: training } = trpc.training.getById.useQuery({ id: trainingId });
  const { data: dayData, mutate: startDayMutation } = trpc.training.session.startDay.useMutation();

  useEffect(() => {
    startDayMutation({
      trainingSessionId: sessionId,
    });
  }, []);

  return (
    <ScreenWrapper className="">
      <TrainingHero imageUrl={training?.imageUrl ?? null} />
      <Heading
        size="2xl"
        className="mb-1 shrink-0 font-black uppercase italic tracking-tighter text-amber-400"
      >
        {training?.name}
      </Heading>
      <View>
        <Text className="mt-auto text-xl font-black text-amber-400">
          Day: {dayData?.stats.currentDay}/{dayData?.stats.totalDays}
        </Text>
      </View>
      <View>
        <Text className="text-xl font-black text-amber-400">
          Today&apos;s Exercises: {dayData?.stats.todaysExercisesAmount}
        </Text>
      </View>
      <TrainingDaySessionPreview sessionExercises={dayData?.workoutExerciseSessions ?? []} />
      <Button
        size="lg"
        className="bg-amber-400 font-bold tracking-widest text-zinc-950"
        onPress={() => router.push(`/training/${trainingId}/session/${sessionId}/exercise`)}
      >
        <ButtonText>Start Exercise</ButtonText>
      </Button>
    </ScreenWrapper>
  );
};
