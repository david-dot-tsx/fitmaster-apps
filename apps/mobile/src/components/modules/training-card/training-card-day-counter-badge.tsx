import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Badge, BadgeText } from "@/components/ui/badge";

export const TrainingCardDayCounterBadge = ({
  currentDay,
  totalDays,
  className,
  isStarted,
}: {
  currentDay?: number;
  totalDays: number;
  className?: string;
  isStarted?: boolean;
}) => {
  return (
    <Badge
      action="primary"
      size="lg"
      className={cn("border-amber-400/40 bg-background-amber/80 py-1.5", className)}
    >
      <BadgeText className="font-orbitron-extrabold uppercase tracking-wide text-amber-400">
        {isStarted && currentDay ? `Day ${currentDay}/${totalDays}` : `Days ${totalDays}`}
      </BadgeText>
    </Badge>
  );
};
