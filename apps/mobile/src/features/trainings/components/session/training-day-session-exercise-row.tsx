import React from "react";
import { Text, View } from "react-native";
import {
  BadgeCheckIcon,
  BadgeIcon as LucideBadgeIcon,
  BadgeXIcon,
  CircleStarIcon,
} from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  WorkoutExerciseSessionStatus,
  type TrainingSessionWorkoutWithDetails,
} from "@repo/validators";

import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

const STATUS_LABEL = {
  [WorkoutExerciseSessionStatus.NOT_STARTED]: "Pending",
  [WorkoutExerciseSessionStatus.IN_PROGRESS]: "Active",
  [WorkoutExerciseSessionStatus.COMPLETED]: "Done",
  [WorkoutExerciseSessionStatus.SKIPPED]: "Skipped",
  CURRENT: "Current",
} as const;

type StatusLabel = keyof typeof STATUS_LABEL;

const StatusBadge = ({ status, className }: { status: StatusLabel; className?: string }) => {
  const badgeStatus: Record<
    StatusLabel,
    { icon: React.ElementType; action: React.ComponentProps<typeof Badge>["action"] }
  > = {
    [WorkoutExerciseSessionStatus.NOT_STARTED]: { icon: LucideBadgeIcon, action: "muted" },
    [WorkoutExerciseSessionStatus.IN_PROGRESS]: { icon: CircleStarIcon, action: "info" },
    [WorkoutExerciseSessionStatus.COMPLETED]: { icon: BadgeCheckIcon, action: "success" },
    [WorkoutExerciseSessionStatus.SKIPPED]: { icon: BadgeXIcon, action: "warning" },
    CURRENT: { icon: CircleStarIcon, action: "info" },
  };

  return (
    <Badge
      size="sm"
      variant="solid"
      action={badgeStatus[status].action}
      className={cn("max-w-[120px]", className)}
    >
      <BadgeText className="text-2xs">{STATUS_LABEL[status]}</BadgeText>
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
  const we = sessionExercise.workoutExercise;
  const meta = [
    we.reps != null ? { label: "Reps", value: String(we.reps) } : null,
    we.weight != null && we.weight > 0 ? { label: "Kg", value: String(we.weight) } : null,
    we.duration != null ? { label: "Sec", value: String(we.duration) } : null,
    we.distance != null ? { label: "M", value: String(we.distance) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <View
      className={cn(
        "flex-row overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900 pl-0 pr-2",
        {
          "bg-success-300/10": sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
          "bg-sky-500/20":
            sessionExercise.status === WorkoutExerciseSessionStatus.IN_PROGRESS || isCurrent,
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
              "text-success-600": sessionExercise.status === WorkoutExerciseSessionStatus.COMPLETED,
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
              <Text className="mt-0.5 text-2xs font-bold uppercase tracking-wider text-zinc-500">
                {we.workoutType}
              </Text>
            </View>
            <StatusBadge
              status={isCurrent ? "CURRENT" : sessionExercise.status}
              className="mt-0.5"
            />
          </View>
          {meta.length > 0 ? (
            <View className="mt-2 flex-row flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800/50 pt-2">
              {meta.map((m) => (
                <View key={`${m.label}-${m.value}`} className="min-w-[48px]">
                  <Text className="font-quantico-bold text-[9px] uppercase tracking-wide text-zinc-500">
                    {m.label}
                  </Text>
                  <Text
                    className={cn(
                      "font-mono text-xs font-bold tabular-nums",
                      m.label === "Kg" ? "text-amber-400" : "text-zinc-200",
                    )}
                  >
                    {m.label === "Kg" ? `${m.value} kg` : m.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
