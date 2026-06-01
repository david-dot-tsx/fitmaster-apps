import React from "react";
import { useLocalSearchParams } from "expo-router";

import { ExerciseDetailsScreen } from "@/features/exercises/screens/exercise-details.screen";

export default function ExerciseDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ExerciseDetailsScreen id={id} />;
}
