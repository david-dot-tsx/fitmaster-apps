import React from "react";
import { CalendarDaysIcon, DumbbellIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

type TrainingStatsProps = {
  daysAmount: number;
  exercisesAmount: number;
};

export const TrainingStats = ({ daysAmount, exercisesAmount }: TrainingStatsProps) => (
  <HStack className="mb-5 mt-3 gap-4">
    <HStack className="items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <Icon as={CalendarDaysIcon} size="sm" color="#fbbf24" />
      <Text className="text-sm font-semibold text-zinc-200">
        {daysAmount} {daysAmount === 1 ? "Day" : "Days"}
      </Text>
    </HStack>
    <HStack className="items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <Icon as={DumbbellIcon} size="sm" color="#fbbf24" />
      <Text className="text-sm font-semibold text-zinc-200">
        {exercisesAmount} {exercisesAmount === 1 ? "Exercise" : "Exercises"}
      </Text>
    </HStack>
  </HStack>
);
