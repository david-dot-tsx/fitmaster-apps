import React, { useMemo } from "react";
import { DumbbellIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { type TrainingSessionWorkoutWithDetails } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

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
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const traitsComponents = useMemo(() => {
    const components = [];
    if (sessionExercise?.targetReps) {
      components.push(<Trait key="reps" name={t("reps")} value={sessionExercise?.targetReps} />);
    }
    if (sessionExercise?.targetWeight) {
      components.push(
        <Trait
          key="weight"
          name={t("weight")}
          value={sessionExercise?.targetWeight}
          unit={t("units.kg")}
        />,
      );
    }
    if (sessionExercise?.targetDistance) {
      components.push(
        <Trait
          key="distance"
          name={t("distance")}
          value={sessionExercise?.targetDistance}
          unit={t("units.meters")}
        />,
      );
    }
    if (sessionExercise?.targetDuration) {
      components.push(
        <Trait
          key="time"
          name={t("duration")}
          value={sessionExercise?.targetDuration}
          unit={t("units.seconds")}
        />,
      );
    }

    return components;
  }, [
    sessionExercise?.targetDistance,
    sessionExercise?.targetDuration,
    sessionExercise?.targetReps,
    sessionExercise?.targetWeight,
    t,
  ]);

  return <VStack className="flex w-full flex-row flex-wrap gap-4 ">{traitsComponents}</VStack>;
};
