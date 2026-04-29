import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { useT } from "@/lib/i18n";
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
  const { t } = useT();

  return (
    <Badge
      action="primary"
      size="lg"
      className={cn("bg-background-amber/80 border-amber-400/40 py-1.5", className)}
    >
      <BadgeText className="font-orbitron-extrabold text-nowrap uppercase tracking-wide text-amber-400">
        {isStarted && currentDay
          ? `${t("day")} ${currentDay}/${totalDays}`
          : `${t("day_other", { count: totalDays })} ${totalDays}`}
      </BadgeText>
    </Badge>
  );
};
