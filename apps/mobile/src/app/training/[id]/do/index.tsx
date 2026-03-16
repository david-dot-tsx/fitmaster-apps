import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingDoScreen } from "@/features/trainings/screens/training-do.screen";

export default function TrainingDoPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TrainingDoScreen id={id} />;
}
