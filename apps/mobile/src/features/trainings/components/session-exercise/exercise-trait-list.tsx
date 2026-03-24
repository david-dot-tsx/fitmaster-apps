import React, { useMemo } from "react";
import { DumbbellIcon } from "lucide-react-native";

import { type TrainingSessionWorkoutWithDetails } from "@repo/validators";

import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

const Trait = ({ name, value, unit }: { name: string; value: number | string; unit?: string }) => {
  return (
    <HStack className="items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <Icon as={DumbbellIcon} size="sm" className="text-amber-400" />
      <Text className="text-sm font-semibold text-zinc-200">{name}</Text>
      <Text className="text-sm font-semibold text-zinc-200">{value ?? "-"}</Text>
      {unit && <Text className="text-sm font-semibold text-zinc-200">{unit}</Text>}
    </HStack>
  );
};

export const TraitList = ({
  sessionExercise,
}: {
  sessionExercise: TrainingSessionWorkoutWithDetails;
}) => {
  const traitsComponents = useMemo(() => {
    const components = [];
    if (sessionExercise?.targetReps) {
      components.push(<Trait key="reps" name="Reps" value={sessionExercise?.targetReps} />);
    }
    if (sessionExercise?.targetWeight) {
      components.push(
        <Trait key="weight" name="Weight" value={sessionExercise?.targetWeight} unit="kg" />,
      );
    }
    if (sessionExercise?.targetDistance) {
      components.push(
        <Trait key="distance" name="Distance" value={sessionExercise?.targetDistance} unit="m" />,
      );
    }
    if (sessionExercise?.targetDuration) {
      components.push(
        <Trait key="time" name="Time" value={sessionExercise?.targetDuration} unit="s" />,
      );
    }

    return components;
  }, [sessionExercise]);

  return <VStack className="flex w-full flex-row flex-wrap gap-4 ">{traitsComponents}</VStack>;
};
