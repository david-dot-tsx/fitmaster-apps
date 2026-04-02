import React from "react";
import { Play, CircleDot, CheckCircle2, XCircle, Star } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { TrainingSessionStatus } from "@repo/validators";

import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

const BADGE_STATUSES = {
  NOT_JOINED: "NOT_JOINED",
  JOINED: "JOINED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

type BadgeStatus = (typeof BADGE_STATUSES)[keyof typeof BADGE_STATUSES];

const getCurrentStatusBadgeText = ({
  trainingSessionStatus,
}: {
  trainingSessionStatus?: TrainingSessionStatus;
}): BadgeStatus => {
  if (!trainingSessionStatus) {
    return BADGE_STATUSES.NOT_JOINED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.NOT_STARTED) {
    return BADGE_STATUSES.JOINED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.IN_PROGRESS) {
    return BADGE_STATUSES.IN_PROGRESS;
  }
  if (trainingSessionStatus === TrainingSessionStatus.COMPLETED) {
    return BADGE_STATUSES.COMPLETED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.CANCELLED) {
    return BADGE_STATUSES.CANCELLED;
  }
  throw new Error("Invalid status");
};

const badgeStatusConfig = {
  [BADGE_STATUSES.NOT_JOINED]: {
    icon: Play,
    action: "primary",
    text: "JOIN NOW",
  },
  [BADGE_STATUSES.JOINED]: {
    icon: Star,
    action: "muted",
    text: "JOINED",
  },
  [BADGE_STATUSES.IN_PROGRESS]: {
    icon: CircleDot,
    action: "info",
    text: "IN PROGRESS",
  },
  [BADGE_STATUSES.COMPLETED]: {
    icon: CheckCircle2,
    action: "success",
    text: "FINISHED",
  },
  [BADGE_STATUSES.CANCELLED]: {
    icon: XCircle,
    action: "error",
    text: "CANCELLED",
  },
} as const;

export const TrainingCardStatusBadge = ({
  trainingSessionStatus,
  className,
}: {
  trainingSessionStatus?: TrainingSessionStatus;
  className?: string;
}) => {
  const badgeStatus = getCurrentStatusBadgeText({ trainingSessionStatus });

  return (
    <Badge
      action={badgeStatusConfig[badgeStatus].action}
      size="lg"
      className={cn("min-w-28", className, {
        "bg-background-amber/80": badgeStatus === BADGE_STATUSES.NOT_JOINED,
      })}
    >
      <BadgeIcon as={badgeStatusConfig[badgeStatus].icon} size="lg" />
      <BadgeText size="sm" className="font-black">
        {badgeStatusConfig[badgeStatus].text}
      </BadgeText>
    </Badge>
  );
};
