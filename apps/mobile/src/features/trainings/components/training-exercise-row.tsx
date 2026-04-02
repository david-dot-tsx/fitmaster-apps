import React from "react";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

type TrainingExerciseRowProps = {
  id: string;
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
  id,
  name,
  imageUrl,
  difficulty,
  bodyPart,
}: TrainingExerciseRowProps) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/exercise/${id}`)}>
      <HStack className="pointer-events-none relative my-1.5 items-center gap-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-3 active:bg-zinc-800">
        <Image
          source={{ uri: imageUrl }}
          className="size-14 rounded-lg bg-zinc-800"
          resizeMode="cover"
        />
        <VStack className="relative flex-1 gap-0.5">
          <Text
            className="font-orbitron-medium text-sm uppercase tracking-widest text-white"
            numberOfLines={1}
          >
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
            <Text className="font-orbitron-medium ml-auto text-xs text-sky-400">
              {/* //TODO: implement XP */}
              15 XP
            </Text>
          </HStack>
        </VStack>
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", "rgba(251,191,36,0.35)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute bottom-0 h-px w-full rounded-lg"
        />
      </HStack>
    </Pressable>
  );
};
