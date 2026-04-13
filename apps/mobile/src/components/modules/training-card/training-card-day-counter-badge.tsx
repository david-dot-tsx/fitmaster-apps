import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

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
  const { t } = useTranslation([NAMESPACES.COMMON]);

  return (
    <Badge
      action="primary"
      size="lg"
      className={cn("bg-background-amber/80 border-amber-400/40 py-1.5", className)}
    >
      <BadgeText className="font-orbitron-extrabold uppercase tracking-wide text-amber-400">
        {isStarted && currentDay
          ? `${t("day")} ${currentDay}/${totalDays}`
          : `${t("day", { count: totalDays })} ${totalDays}`}
      </BadgeText>
    </Badge>
  );
};
