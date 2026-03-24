import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingDetailsScreen } from "@/features/trainings/screens/training-details.screen";

export default function TrainingDetailsPage() {
  const { trainingId } = useLocalSearchParams<{ trainingId: string }>();

  return <TrainingDetailsScreen trainingId={trainingId} />;
}
