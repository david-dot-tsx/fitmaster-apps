import React from "react";
import { ActivitySquareIcon, ZapIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

type ExerciseMetaProps = {
  difficulty: string;
  bodyPart: string;
};

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: "text-green-400",
  MEDIUM: "text-amber-400",
  HARD: "text-red-400",
};

const DIFFICULTY_BORDER: Record<string, string> = {
  EASY: "border-green-400/40",
  MEDIUM: "border-amber-400/40",
  HARD: "border-red-400/40",
};

export const ExerciseMeta = ({ difficulty, bodyPart }: ExerciseMetaProps) => (
  <HStack className="mb-5 mt-3 gap-3">
    <HStack
      className={`items-center gap-1.5 rounded-lg border bg-zinc-900 px-3 py-2 ${DIFFICULTY_BORDER[difficulty] ?? "border-zinc-800"}`}
    >
      <Icon as={ZapIcon} size="sm" color="#fbbf24" />
      <Text className={`text-sm font-semibold ${DIFFICULTY_COLOR[difficulty] ?? "text-zinc-400"}`}>
        {difficulty}
      </Text>
    </HStack>

    <HStack className="items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <Icon as={ActivitySquareIcon} size="sm" color="#fbbf24" />
      <Text className="text-sm font-semibold text-zinc-200">{bodyPart}</Text>
    </HStack>
  </HStack>
);
