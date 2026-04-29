import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  BadgeCheckIcon,
  BadgeIcon as LucideBadgeIcon,
  BadgeXIcon,
  CircleStarIcon,
} from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { type ResourceKey } from "i18next";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  WorkoutExerciseSessionStatus,
  type TrainingSessionWorkoutWithDetails,
} from "@repo/validators";
import { getTKey } from "@repo/i18n/mobile";

import { useT } from "@/lib/i18n";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

const STATUS_BADGE = {
  [WorkoutExerciseSessionStatus.NOT_STARTED]: WorkoutExerciseSessionStatus.NOT_STARTED,
  [WorkoutExerciseSessionStatus.IN_PROGRESS]: WorkoutExerciseSessionStatus.IN_PROGRESS,
  [WorkoutExerciseSessionStatus.COMPLETED]: WorkoutExerciseSessionStatus.COMPLETED,
  [WorkoutExerciseSessionStatus.SKIPPED]: WorkoutExerciseSessionStatus.SKIPPED,
  CURRENT: "CURRENT",
} as const;

type StatusBadgeType = "CURRENT" | WorkoutExerciseSessionStatus;

const StatusBadge = ({ status, className }: { status: StatusBadgeType; className?: string }) => {
  const { t } = useT();
  const badgeStatus: Record<
    StatusBadgeType,
    {
      icon: React.ElementType;
      action: React.ComponentProps<typeof Badge>["action"];
      label: ResourceKey;
    }
  > = {
    [WorkoutExerciseSessionStatus.NOT_STARTED]: {
      icon: LucideBadgeIcon,
      action: "muted",
      label: getTKey("common:pending"),
    },
    [WorkoutExerciseSessionStatus.IN_PROGRESS]: {
      icon: CircleStarIcon,
      action: "info",
      label: getTKey("common:active"),
    },
    [WorkoutExerciseSessionStatus.COMPLETED]: {
      icon: BadgeCheckIcon,
      action: "success",
      label: getTKey("common:done"),
    },
    [WorkoutExerciseSessionStatus.SKIPPED]: {
      icon: BadgeXIcon,
      action: "warning",
      label: getTKey("common:skipped"),
    },
    CURRENT: { icon: CircleStarIcon, action: "info", label: getTKey("common:current") },
  };

  return (
    <Badge
      size="sm"
      variant="solid"
      action={badgeStatus[status].action}
      className={cn("max-w-[120px]", className)}
    >
      <BadgeText className="text-2xs">{t(badgeStatus[status].label)}</BadgeText>
      <BadgeIcon as={badgeStatus[status].icon} size="sm" className="ml-1" />
    </Badge>
  );
};

export const TrainingDaySessionExerciseRow = ({
  sessionExercise,
  index,
  barClass,
  isCurrent,
}: {
  sessionExercise: TrainingSessionWorkoutWithDetails;
  index: number;
  barClass: string;
  isCurrent: boolean;
}) => {
  const { trainingId, sessionId } = useLocalSearchParams<{
    trainingId: string;
    sessionId: string;
  }>();
  const router = useRouter();
  const { t } = useT();
  const we = sessionExercise.workoutExercise;
  const meta = [
    we.reps != null ? { label: t("reps"), value: String(we.reps), units: t("units.reps") } : null,
    we.weight != null && we.weight > 0
      ? { label: t("weight"), value: String(we.weight), units: t("units.kg") }
      : null,
    we.duration != null
      ? { label: t("duration"), value: String(we.duration), units: t("units.seconds") }
      : null,
    we.distance != null
      ? { label: t("distance"), value: String(we.distance), units: t("units.meters") }
      : null,
  ].filter(Boolean) as { label: string; value: string; units: string }[];

  return (
    <Pressable
      onPress={() => {
        if (isCurrent) {
          router.push(`/training/${trainingId}/session/${sessionId}/exercise`);
        }
      }}
    >
      <View
        pointerEvents="none"
        className={cn(
          "flex-row overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900 pl-0 pr-2",
          {
            "bg-success-300/10": sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
            "bg-sky-500/20":
              sessionExercise.status === WorkoutExerciseSessionStatus.IN_PROGRESS || isCurrent,
            "active:bg-sky-500/5": isCurrent,
          },
        )}
      >
        <View className={cn("w-1 self-stretch rounded-l-xl", barClass)} />
        <View className="min-w-0 flex-1 flex-row items-start gap-2 py-2.5 pl-3 pr-1">
          <View
            className={cn(
              "mt-0.5 aspect-square w-7 items-center justify-center rounded-md border border-zinc-800/80 bg-zinc-800/80",
              {
                "bg-success-300/30 border-success-300/50 border":
                  sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
                "border border-sky-500/40 bg-sky-500/20":
                  sessionExercise.status === WorkoutExerciseSessionStatus.IN_PROGRESS || isCurrent,
              },
            )}
          >
            <Text
              className={cn("font-orbitron-bold text-xs text-zinc-400", {
                "text-success-600":
                  sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
                "text-sky-500":
                  sessionExercise.status === WorkoutExerciseSessionStatus.IN_PROGRESS || isCurrent,
              })}
            >
              {index + 1}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-start gap-2">
              <View className="min-w-0 flex-1">
                <Text
                  className={cn("text-sm font-semibold leading-tight text-zinc-100", {
                    "text-success-600":
                      sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
                  })}
                  numberOfLines={2}
                >
                  {we.exercise.name}
                </Text>
                <Text className="text-2xs mt-0.5 font-bold uppercase tracking-wider text-zinc-500">
                  {we.workoutType}
                </Text>
              </View>
              <View pointerEvents="none">
                <StatusBadge
                  status={isCurrent ? STATUS_BADGE.CURRENT : sessionExercise.status}
                  className="mt-0.5"
                />
              </View>
            </View>
            {meta.length > 0 ? (
              <View className="mt-2 flex-row flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800/50 pt-2">
                {meta.map((m) => (
                  <View key={`${m.label}-${m.value}`} className="min-w-[48px]">
                    <Text className="font-quantico-bold text-[9px] uppercase tracking-wide text-zinc-500">
                      {m.label}
                    </Text>
                    {/* //TODO: create const with units */}
                    <Text
                      className={cn(
                        "font-mono text-xs font-bold tabular-nums",
                        m.label === t("weight") ? "text-amber-400" : "text-zinc-200",
                      )}
                    >
                      {`${m.value}${m.units}`}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
