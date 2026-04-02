import { Text, Pressable } from "react-native";
import React from "react";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  SparklesIcon,
  Star,
  XCircleIcon,
} from "lucide-react-native";

import { TrainingSessionStatus } from "@repo/validators";

import { Icon } from "@/components/ui/icon";

const SUBTITLE_STATUS = {
  NOT_JOINED: "NOT_JOINED",
  JOINED: "JOINED",
  AWAITING_TODAY: "AWAITING_TODAY",
  COMPLETED_TODAY: "COMPLETED_TODAY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
type SubtitleType = (typeof SUBTITLE_STATUS)[keyof typeof SUBTITLE_STATUS];

const getSubtitleStatus = ({
  trainingSessionStatus,
  hasUserCompletedThisDay,
}: {
  trainingSessionStatus?: TrainingSessionStatus;
  hasUserCompletedThisDay: boolean;
}): SubtitleType => {
  if (!trainingSessionStatus) {
    return SUBTITLE_STATUS.NOT_JOINED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.NOT_STARTED) {
    return SUBTITLE_STATUS.JOINED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.COMPLETED) {
    return SUBTITLE_STATUS.COMPLETED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.CANCELLED) {
    return SUBTITLE_STATUS.CANCELLED;
  }
  if (trainingSessionStatus === TrainingSessionStatus.IN_PROGRESS) {
    if (hasUserCompletedThisDay) {
      return SUBTITLE_STATUS.COMPLETED_TODAY;
    }

    return SUBTITLE_STATUS.AWAITING_TODAY;
  }

  throw new Error("Invalid status");
};

const subtitleConfig: Record<SubtitleType, { icon: React.ElementType; text: string }> = {
  [SUBTITLE_STATUS.NOT_JOINED]: {
    icon: SparklesIcon,
    text: "The training is available",
  },
  [SUBTITLE_STATUS.JOINED]: {
    icon: Star,
    text: "Start your training",
  },
  [SUBTITLE_STATUS.AWAITING_TODAY]: {
    icon: PlayCircleIcon,
    text: "Complete today's session",
  },
  [SUBTITLE_STATUS.COMPLETED_TODAY]: {
    icon: CheckCircleIcon,
    text: "Today's session completed",
  },
  [SUBTITLE_STATUS.COMPLETED]: {
    icon: CheckCircleIcon,
    text: "Training completed",
  },
  [SUBTITLE_STATUS.CANCELLED]: {
    icon: XCircleIcon,
    text: "Training cancelled",
  },
} as const;

interface TrainingCardSubtitleProps {
  trainingSessionStatus?: TrainingSessionStatus;
  hasUserCompletedThisDay: boolean;
  onPress?: () => void;
  disabled?: boolean;
}
export const TrainingCardSubtitle = ({
  trainingSessionStatus,
  hasUserCompletedThisDay,
  onPress,
  disabled,
}: TrainingCardSubtitleProps) => {
  const subtitleStatus = getSubtitleStatus({ trainingSessionStatus, hasUserCompletedThisDay });

  return (
    <Pressable
      className="mb-2 flex-row items-center gap-2 self-start rounded-3xl bg-background-amber/50 px-2.5 py-1"
      onPress={onPress}
      disabled={disabled}
    >
      <Icon as={subtitleConfig[subtitleStatus].icon} size="sm" color="#fbbf24" />
      <Text className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 ">
        {subtitleConfig[subtitleStatus].text}
      </Text>
    </Pressable>
  );
};
