import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { TrainingDaySessionPreview } from "@/features/trainings/components/session/training-day-session-preview";
import { VStack } from "@/components/ui/vstack";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import TrainingCard from "@/components/modules/training-card/training-card";

export const TrainingSessionScreen = ({
  trainingId,
  sessionId,
}: {
  trainingId: string;
  sessionId: string;
}) => {
  const { data: training } = trpc.training.getByIdCustomer.useQuery({ id: trainingId });
  const { data: dayData, mutate: startDayMutation } = trpc.training.session.startDay.useMutation();

  useEffect(() => {
    // mutation is idempotent, it's enough to run it once
    if (dayData) return;
    startDayMutation({
      trainingSessionId: sessionId,
    });
  }, [dayData, sessionId, startDayMutation]);

  return (
    <ScreenWrapper
      header={{
        title: training?.name ?? "",
        description: "Your training plan",
        subtitle: "Today's training plan",
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <VStack className="gap-4">
          <TrainingCard
            imageUrl={training?.imageUrl ?? undefined}
            trainingName={training?.name ?? ""}
            stats={
              dayData?.stats ??
              training?.trainingSessions[0]?.stats ?? {
                totalDays: training?.daysAmount ?? 0,
                currentDay: 1,
                hasUserCompletedThisDay: false,
              }
            }
            status={training?.trainingSessions[0]?.status}
            action={{
              onPress: () => router.push(`/training/${trainingId}/session/${sessionId}/exercise`),
              text: "Start Exercise",
            }}
          />
          <TrainingDaySessionPreview sessionExercises={dayData?.workoutExerciseSessions ?? []} />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
};
