import React from "react";
import { Text, View } from "react-native";
import { FlameIcon, SnowflakeIcon, ZapIcon } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { type TrainingSessionWorkoutWithDetails } from "@repo/validators";

import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { type BlockType } from "@/features/trainings/components/session/training-day-session-plan";
import { TrainingDaySessionExerciseRow } from "@/features/trainings/components/session/training-day-session-exercise-row";

const BLOCK_CONFIG: Record<
  BlockType,
  {
    label: string;
    icon: React.ElementType;
    accentClass: string;
    barClass: string;
    shadowClass: string;
  }
> = {
  WARM_UP: {
    label: "Warm up",
    icon: ZapIcon,
    accentClass: "text-amber-400",
    barClass: "bg-amber-400",
    shadowClass: "shadow-amber-400/20",
  },
  MAIN_WORKOUT: {
    label: "Main workout",
    icon: FlameIcon,
    accentClass: "text-amber-500",
    barClass: "bg-amber-500",
    shadowClass: "shadow-amber-500/20",
  },
  COOL_DOWN: {
    label: "Cool down",
    icon: SnowflakeIcon,
    accentClass: "text-blue-400",
    barClass: "bg-blue-400",
    shadowClass: "shadow-blue-400/20",
  },
};

export const TrainingDaySessionBlock = ({
  blockType,
  exercises,
  currentExercise,
}: {
  blockType: BlockType;
  exercises: TrainingSessionWorkoutWithDetails[];
  currentExercise: TrainingSessionWorkoutWithDetails | undefined;
}) => {
  const config = BLOCK_CONFIG[blockType];

  return (
    <VStack className={cn("mb-4 ", config.shadowClass)}>
      <View className="mb-3 flex-row items-center gap-3 border-b border-zinc-800/80 pb-3">
        <View className="rounded-full border border-zinc-800 bg-zinc-900 p-2">
          <Icon as={config.icon} size="xl" className={config.accentClass} />
        </View>
        <View className="flex-1">
          <Text className="font-orbitron-semibold text-lg tracking-widest text-zinc-100">
            {config.label}
          </Text>
          <Text className="text-xs uppercase tracking-wider text-zinc-500">
            {exercises.length} exercise{exercises.length === 1 ? "" : "s"}
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
