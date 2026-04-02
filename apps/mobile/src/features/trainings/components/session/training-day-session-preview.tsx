import React from "react";
import { View } from "react-native";

import { type TrainingSessionWorkoutWithDetails } from "@repo/validators";

import { TrainingDaySessionPlan } from "@/features/trainings/components/session/training-day-session-plan";
import { TrainingDaySessionAbout } from "@/features/trainings/components/session/training-day-session-about";

interface TrainingDaySessionPreviewProps {
  sessionExercises: TrainingSessionWorkoutWithDetails[];
}

export const TrainingDaySessionPreview = ({ sessionExercises }: TrainingDaySessionPreviewProps) => {
  return (
    <View className="gap-8 pb-2 pt-4">
      <TrainingDaySessionAbout sessionExercises={sessionExercises} />
      <TrainingDaySessionPlan sessionExercises={sessionExercises} className="mt-4" />
    </View>
  );
};
