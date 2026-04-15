import React from "react";
import { Text, View } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useTranslation } from "react-i18next";

import { type TrainingSessionWorkoutWithDetails } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { TrainingDaySessionExerciseRow } from "@/features/trainings/components/session/training-day-session-exercise-row";
import {
  type BlockType,
  WORKOUT_BLOCK_DISPLAY,
} from "@/features/trainings/constants/workout-block-display";

export const TrainingDaySessionBlock = ({
  blockType,
  exercises,
  currentExercise,
}: {
  blockType: BlockType;
  exercises: TrainingSessionWorkoutWithDetails[];
  currentExercise: TrainingSessionWorkoutWithDetails | undefined;
}) => {
  const config = WORKOUT_BLOCK_DISPLAY[blockType];
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <VStack className={cn("mb-4 ", config.shadowClass)}>
      <View className="mb-3 flex-row items-center gap-3 border-b border-zinc-800/80 pb-3">
        <View className="rounded-full border border-zinc-800 bg-zinc-900 p-2">
          <Icon as={config.icon} size="xl" className={config.accentClass} />
        </View>
        <View className="flex-1">
          <Text className="font-orbitron-semibold text-lg tracking-widest text-zinc-100">
            {t(config.label)}
          </Text>
          <Text className="text-xs uppercase tracking-wider text-zinc-500">
            {exercises.length} {t("exercise", { count: exercises.length })}
          </Text>
        </View>
        <View className="aspect-square rounded-md border border-amber-400/25 bg-zinc-900 p-1">
          <Text className="aspect-square text-center font-orbitron-bold text-sm text-amber-400/90">
            {exercises.length}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        {exercises.map((sessionExercise, index) => (
          <TrainingDaySessionExerciseRow
            key={sessionExercise.id}
            sessionExercise={sessionExercise}
            index={index}
            barClass={config.barClass}
            isCurrent={sessionExercise.id === currentExercise?.id}
          />
        ))}
      </View>
    </VStack>
  );
};
