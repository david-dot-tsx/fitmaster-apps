import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingSessionScreen } from "@/features/trainings/screens/training-session.screen";

export default function TrainingSessionPage() {
  const { trainingId, sessionId } = useLocalSearchParams<{
    trainingId: string;
    sessionId: string;
  }>();

  return <TrainingSessionScreen trainingId={trainingId} sessionId={sessionId} />;
}
