import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingSessionExerciseScreen } from "@/features/trainings/screens/training-session-exercise.screen";

export default function TrainingSessionExercisePage() {
  const { trainingId, sessionId } = useLocalSearchParams<{
    trainingId: string;
    sessionId: string;
  }>();

  return <TrainingSessionExerciseScreen trainingId={trainingId} sessionId={sessionId} />;
}
