import React from "react";
import { Image } from "react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

type TrainingExerciseRowProps = {
  name: string;
  imageUrl: string;
  difficulty: string;
  bodyPart: string;
};

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: "text-green-400",
  MEDIUM: "text-amber-400",
  HARD: "text-red-400",
};

export const TrainingExerciseRow = ({
  name,
  imageUrl,
  difficulty,
  bodyPart,
}: TrainingExerciseRowProps) => (
  <HStack className="mb-3 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
    <Image
      source={{ uri: imageUrl }}
      className="size-14 rounded-lg bg-zinc-800"
      resizeMode="cover"
    />
    <VStack className="flex-1 gap-0.5">
      <Text className="text-sm font-bold uppercase tracking-wide text-white" numberOfLines={1}>
        {name}
      </Text>
      <HStack className="items-center gap-2">
        <Text className="text-xs font-medium text-zinc-400">{bodyPart}</Text>
        <Text className="text-zinc-700">·</Text>
        <Text
          className={`text-xs font-semibold ${DIFFICULTY_COLOR[difficulty] ?? "text-zinc-400"}`}
        >
          {difficulty}
        </Text>
      </HStack>
    </VStack>
  </HStack>
);
