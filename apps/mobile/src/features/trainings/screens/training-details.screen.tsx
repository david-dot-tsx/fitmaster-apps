import React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { TrainingHero } from "@/features/trainings/components/training-hero";
import { TrainingStats } from "@/features/trainings/components/training-stats";
import { TrainingDescription } from "@/features/trainings/components/training-description";
import { TrainingExerciseList } from "@/features/trainings/components/training-exercise-list";

export const TrainingDetailsScreen = ({ trainingId }: { trainingId: string }) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const {
    data: training,
    isLoading,
    isError,
  } = trpc.training.getByIdCustomer.useQuery({ id: trainingId });

  const { data: myTrainings } = trpc.training.session.myTrainings.useQuery();
  const enrolment = myTrainings?.find((t) => t.trainingId === trainingId) ?? null;
  const isEnrolled = enrolment !== null;

  const { mutate: newTrainingSession, isPending } = trpc.training.session.new.useMutation({
    onSuccess: () => {
      utils.training.session.myTrainings.invalidate();
    },
  });

  if (isLoading) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </ScreenWrapper>
    );
  }

  if (isError || !training) {
    return (
      <ScreenWrapper className="items-center justify-center px-8">
        <Text className="text-center text-zinc-400">Training not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 rounded-xl bg-amber-400 px-6 py-3">
          <Text className="font-bold text-zinc-950">Go back</Text>
        </Pressable>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TrainingHero imageUrl={training.imageUrl} />

        <View className="px-4 pt-6">
          <Heading
            size="2xl"
            className="mb-1 font-black uppercase italic tracking-tighter text-amber-400"
          >
            {training.name}
          </Heading>

          <TrainingStats
            daysAmount={training.daysAmount}
            exercisesAmount={training.exercises.length}
          />

          {!isEnrolled ? (
            <Pressable
              onPress={() => newTrainingSession({ trainingId })}
              disabled={isPending}
              className="mb-5 items-center rounded-xl bg-amber-400 py-3.5"
            >
              {isPending ? (
                <ActivityIndicator color="#09090b" />
              ) : (
                <Text className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                  Join Training
                </Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push(`/training/${trainingId}/do/${enrolment?.id}`)}
              className="mb-5 items-center rounded-xl bg-amber-400 py-3.5"
            >
              <Text className="text-sm font-bold uppercase tracking-widest text-black">
                Start Training
              </Text>
            </Pressable>
          )}

          {training.description ? <TrainingDescription description={training.description} /> : null}

          <TrainingExerciseList exercises={training.exercises} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
