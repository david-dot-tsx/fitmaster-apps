import { Text, Pressable } from "react-native";
import React, { useMemo } from "react";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  SparklesIcon,
  Star,
  XCircleIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { TrainingSessionStatus } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

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
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const subtitleConfig = useMemo((): Record<
    SubtitleType,
    { icon: React.ElementType; text: string }
  > => {
    return {
      [SUBTITLE_STATUS.NOT_JOINED]: {
        icon: SparklesIcon,
        text: t("mobile:training.sesssion.card.subtitle.notJoined"),
      },
      [SUBTITLE_STATUS.JOINED]: {
        icon: Star,
        text: t("mobile:training.sesssion.card.subtitle.joined"),
      },
      [SUBTITLE_STATUS.AWAITING_TODAY]: {
        icon: PlayCircleIcon,
        text: t("mobile:training.sesssion.card.subtitle.awaitingToday"),
      },
      [SUBTITLE_STATUS.COMPLETED_TODAY]: {
        icon: CheckCircleIcon,
        text: t("mobile:training.sesssion.card.subtitle.completedToday"),
      },
      [SUBTITLE_STATUS.COMPLETED]: {
        icon: CheckCircleIcon,
        text: t("mobile:training.sesssion.card.subtitle.completed"),
      },
      [SUBTITLE_STATUS.CANCELLED]: {
        icon: XCircleIcon,
        text: t("mobile:training.sesssion.card.subtitle.cancelled"),
      },
    } as const;
  }, [t]);

  const subtitleStatus = getSubtitleStatus({ trainingSessionStatus, hasUserCompletedThisDay });

  return (
    <Pressable
      className="bg-background-amber/50 mb-2 flex-row items-center gap-2 self-start rounded-3xl px-2.5 py-1"
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
