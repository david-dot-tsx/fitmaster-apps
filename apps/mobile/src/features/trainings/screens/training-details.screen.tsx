import React from "react";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { TrainingStats } from "@/features/trainings/components/training-stats";
import { TrainingExerciseList } from "@/features/trainings/components/training-exercise-list";
import { VStack } from "@/components/ui/vstack";
import { Section } from "@/components/ui/section";
import TrainingCard from "@/components/modules/training-card/training-card";
import { useToastNotification } from "@/components/modules/toast-notifcation/toast-notification";

export const TrainingDetailsScreen = ({ trainingId }: { trainingId: string }) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { openToast } = useToastNotification();
  const {
    data: training,
    isLoading,
    isError,
  } = trpc.training.getByIdCustomer.useQuery({ id: trainingId });

  const { data: myTrainings } = trpc.training.session.myTrainings.useQuery();
  const trainingSession = myTrainings?.find((t) => t.trainingId === trainingId) ?? null;

  const { mutate: newTrainingSession, status: newTrainingSessionStatus } =
    trpc.training.session.new.useMutation({
      onSuccess: () => {
        utils.training.session.myTrainings.invalidate();
        router.push(`/training/${trainingId}/session/${trainingSession?.id}`);
      },
      onError: () => {
        openToast({
          title: "Failed to enroll in training",
          description: "Please try again later.",
          action: "error",
        });
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
    <ScreenWrapper
      header={{
        title: training.name,
        description: "Discover",
        subtitle: "Training plan details.",
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TrainingCard
          imageUrl={training.imageUrl ?? undefined}
          trainingName={training.name}
          stats={
            trainingSession?.stats ?? {
              totalDays: training.daysAmount,
              currentDay: 1,
              hasUserCompletedThisDay: false,
            }
          }
          status={trainingSession?.status}
          action={{
            onPress: () => {
              if (trainingSession) {
                router.push(`/training/${trainingId}/session/${trainingSession?.id}`);
              } else {
                newTrainingSession({ trainingId });
              }
            },
            text: trainingSession ? "Start Training" : "Join Training",
            disabled: newTrainingSessionStatus === "pending",
          }}
        />
        <VStack className="mt-4 gap-4">
          <TrainingStats
            daysAmount={training.daysAmount}
            exercisesAmount={training.exercises.length}
          />

          <Section title="About">
            <Text className="text-zinc-300">{training.description}</Text>
          </Section>
          <TrainingExerciseList exercises={training.exercises} />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
};
