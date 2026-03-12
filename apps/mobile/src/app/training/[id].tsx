// eslint-disable-next-line check-file/filename-naming-convention
import React from "react";
import { useLocalSearchParams } from "expo-router";

import { TrainingDetailsScreen } from "@/features/trainings/screens/training-details.screen";

export default function TrainingDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TrainingDetailsScreen id={id} />;
}
