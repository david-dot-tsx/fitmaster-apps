import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingSessionFinishedScreen } from "@/features/trainings/screens/training-session-finished.screen";

export default function TrainingSessionFinishedPage() {
  const { trainingId, sessionId } = useLocalSearchParams<{
    trainingId: string;
    sessionId: string;
  }>();

  return <TrainingSessionFinishedScreen trainingId={trainingId} sessionId={sessionId} />;
}
