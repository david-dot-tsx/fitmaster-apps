import React from "react";
import { ActivitySquareIcon, StarIcon, ZapIcon } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Difficulty } from "@repo/validators";

import { useT } from "@/lib/i18n";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

type ExerciseMetaProps = {
  difficulty: string;
  bodyPart: string;
};

export const ExerciseMeta = ({ difficulty, bodyPart }: ExerciseMetaProps) => {
  const { t } = useT();

  return (
    <HStack className="mb-5 mt-3 gap-3">
      <HStack
        className={cn(
          "items-center gap-1.5 rounded-lg border bg-zinc-900 px-3 py-2",
          "border-zinc-800",
          {
            "border-green-400/40 ": difficulty === Difficulty.EASY,
            "border-amber-400/40": difficulty === Difficulty.MEDIUM,
            "border-red-400/40": difficulty === Difficulty.HARD,
          },
        )}
      >
        <Icon as={ZapIcon} size="sm" color="#fbbf24" />
        <Text
          className={cn("text-sm font-semibold", {
            "text-green-400": difficulty === "EASY",
            "text-amber-400": difficulty === "MEDIUM",
            "text-red-400": difficulty === "HARD",
          })}
        >
          {difficulty}
        </Text>
      </HStack>

      <HStack className="items-center gap-1.5 rounded-lg border border-amber-400/40 bg-zinc-900 px-3 py-2">
        <Icon as={ActivitySquareIcon} size="sm" color="#fbbf24" />
        <Text className="text-sm font-semibold text-zinc-200">{bodyPart}</Text>
      </HStack>
      <HStack className="ml-auto items-center gap-1.5 rounded-lg border border-sky-400/40 bg-zinc-900 px-3 py-2">
        <Icon as={StarIcon} size="sm" className="text-sky-400" />
        <Text className="text-sm font-semibold text-zinc-200">15 {t("units.xp")}</Text>
      </HStack>
    </HStack>
  );
};
