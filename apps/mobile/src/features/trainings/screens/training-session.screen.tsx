import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";
import { type MutationStatus } from "@tanstack/react-query";

import { trpc } from "@/lib/trpc/client";
import { TrainingDaySessionPreview } from "@/features/trainings/components/session/training-day-session-preview";
import { VStack } from "@/components/ui/vstack";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import TrainingCard from "@/components/modules/training-card/training-card";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";

const getRenderableComponentStatus = ({
  status,
  failureCount,
}: {
  status: MutationStatus;
  failureCount: number;
}) => {
  if (status === "success") {
    return "success";
  }
  if (status === "pending" && failureCount === 0) {
    return "pending";
  }

  return "error";
};

export const TrainingSessionScreen = ({
  trainingId,
  sessionId,
}: {
  trainingId: string;
  sessionId: string;
}) => {
  const {
    data: dayData,
    mutate: startDayMutation,
    status,
    failureCount,
  } = trpc.training.session.startDay.useMutation();

  const renderableComponentStatus = getRenderableComponentStatus({
    status,
    failureCount,
  });

  const fetchDayData = useCallback(() => {
    startDayMutation({
      trainingSessionId: sessionId,
    });
  }, [startDayMutation, sessionId]);

  useEffect(() => {
    // mutation is idempotent, it's enough to run it once
    if (dayData) return;
    fetchDayData();
  }, [dayData, fetchDayData]);

  return (
    <ScreenWrapper
      header={{
        title: dayData?.trainingSession.training.name ?? "Today",
        description: "Your training plan",
        subtitle: "Today's training plan",
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      {renderableComponentStatus === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {renderableComponentStatus === "error" && (
        <QueryErrorHandler refetch={fetchDayData} isFetching={false} />
      )}
      {renderableComponentStatus === "success" && dayData != null && (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        >
          <VStack className="gap-4">
            <TrainingCard
              imageUrl={dayData.trainingSession.training.imageUrl ?? undefined}
              trainingName={dayData.trainingSession.training.name}
              stats={dayData.stats}
              status={dayData.trainingSession.status}
              action={{
                onPress: () => router.push(`/training/${trainingId}/session/${sessionId}/exercise`),
                text: "Start Exercise",
              }}
            />
            <TrainingDaySessionPreview sessionExercises={dayData.workoutExerciseSessions} />
          </VStack>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};
