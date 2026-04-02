import React from "react";
import { CalendarDaysIcon, DumbbellIcon, PercentIcon } from "lucide-react-native";

import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

type TrainingStatsProps = {
  daysAmount: number;
  exercisesAmount: number;
  percentage?: number;
};

export const TrainingStats = ({
  daysAmount,
  exercisesAmount,
  percentage = 0,
}: TrainingStatsProps) => (
  <HStack className="gap-4">
    <Badge action="muted">
      <BadgeIcon as={CalendarDaysIcon} size="lg" className="text-amber-400" />
      <BadgeText size="md" className=" text-zinc-200">
        {daysAmount} Days
      </BadgeText>
    </Badge>
    <Badge action="muted">
      <BadgeIcon as={DumbbellIcon} size="lg" className="text-amber-400" />
      <BadgeText size="md" className=" text-zinc-200">
        {exercisesAmount} Exercises
      </BadgeText>
    </Badge>
    <Badge action="muted">
      <BadgeIcon as={PercentIcon} size="lg" className="text-amber-400" />
      <BadgeText size="md" className=" text-zinc-200">
        {percentage}% Completed
      </BadgeText>
    </Badge>
  </HStack>
);
