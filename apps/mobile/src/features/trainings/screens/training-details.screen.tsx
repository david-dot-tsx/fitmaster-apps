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

export const TrainingDetailsScreen = ({ id }: { id: string }) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: training, isLoading, isError } = trpc.training.getByIdCustomer.useQuery({ id });

  const { data: myTrainings } = trpc.training.enrolment.myTrainings.useQuery();
  const enrolment = myTrainings?.find((t) => t.trainingId === id) ?? null;
  const isEnrolled = enrolment !== null;

  const ENROLMENT_STATUS_LABEL: Record<string, string> = {
    NOT_STARTED: "Start Training",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const { mutate: joinTraining, isPending: isJoining } = trpc.training.enrolment.join.useMutation({
    onSuccess: () => {
      utils.training.enrolment.myTrainings.invalidate();
    },
  });

  const { mutate: startTraining, isPending: isStarting } =
    trpc.training.enrolment.start.useMutation({
      onSuccess: () => {
        utils.training.enrolment.myTrainings.invalidate();
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
              onPress={() => joinTraining({ trainingId: id })}
              disabled={isJoining}
              className="mb-5 items-center rounded-xl bg-amber-400 py-3.5"
            >
              {isJoining ? (
                <ActivityIndicator color="#09090b" />
              ) : (
                <Text className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                  Join Training
                </Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={() => (enrolment.status === "NOT_STARTED" ? startTraining({}) : undefined)}
              disabled={enrolment.status !== "NOT_STARTED" || isStarting}
              className="mb-5 items-center rounded-xl py-3.5"
              style={{
                backgroundColor: enrolment.status === "NOT_STARTED" ? "#fbbf24" : "#27272a",
              }}
            >
              {isStarting ? (
                <ActivityIndicator color="#09090b" />
              ) : (
                <Text
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{
                    color: enrolment.status === "NOT_STARTED" ? "#09090b" : "#71717a",
                  }}
                >
                  {ENROLMENT_STATUS_LABEL[enrolment.status]}
                </Text>
              )}
            </Pressable>
          )}

          {training.description ? <TrainingDescription description={training.description} /> : null}

          <TrainingExerciseList exercises={training.exercises} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
