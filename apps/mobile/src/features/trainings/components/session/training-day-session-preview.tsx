import { Text, SectionList, View } from "react-native";
import React from "react";
import { entries, groupBy, map, pipe, sortBy } from "remeda";
import {
  BadgeCheckIcon,
  DumbbellIcon,
  SnowflakeIcon,
  ZapIcon,
  BadgeIcon as LucideBadgeIcon,
  CircleStarIcon,
  BadgeXIcon,
} from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import {
  WorkoutExerciseSessionStatus,
  type TrainingSessionWorkoutWithDetails,
} from "@repo/validators";

import { Icon } from "@/components/ui/icon";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

interface TrainingDaySessionPreviewProps {
  sessionExercises: TrainingSessionWorkoutWithDetails[];
}
export const TrainingDaySessionPreview = ({ sessionExercises }: TrainingDaySessionPreviewProps) => {
  const sections = pipe(
    sessionExercises,
    groupBy((sessionExercise) => sessionExercise.workoutExercise.workoutBlockType),
    entries(),
    map(([blockType, sessionExercisesInBlock]) => ({
      title: blockType,
      data: sessionExercisesInBlock,
    })),
    sortBy((section) => {
      const priority = { WARM_UP: 1, MAIN_WORKOUT: 2, COOL_DOWN: 3, REST: 4 };

      return priority[section.title];
    }),
  );

  return (
    <View className="flex-1">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} totalExercisesInSection={section.data.length} />
        )}
        renderItem={({ item, index }) => <ListElement sessionExercise={item} index={index} />}
      />
    </View>
  );
};
const SectionHeader = ({
  title,
  totalExercisesInSection,
}: {
  title: string;
  totalExercisesInSection: number;
}) => {
  const icon = {
    WARM_UP: ZapIcon,
    MAIN_WORKOUT: DumbbellIcon,
    COOL_DOWN: SnowflakeIcon,
  };

  return (
    <View className="mb-2 mt-4 flex flex-row items-center gap-2 border-t border-amber-400/10 pt-2.5">
      <View className="rounded-full border border-amber-400/30 bg-zinc-900 p-2">
        <Icon
          as={icon[title as keyof typeof icon]}
          size="xl"
          className={cn("text-amber-400", {
            "text-amber-400": title === "WARM_UP",
            "text-amber-500": title === "MAIN_WORKOUT",
            "text-blue-400": title === "COOL_DOWN",
          })}
        />
      </View>
      <Text className="text-xl font-semibold text-zinc-200">{title}</Text>
      <Text className="ml-auto text-xl text-zinc-500">({totalExercisesInSection})</Text>
    </View>
  );
};

const StatusBadge = ({
  status,
  className,
}: {
  status: WorkoutExerciseSessionStatus;
  className?: string;
}) => {
  const badgeStatus: Record<
    WorkoutExerciseSessionStatus,
    { icon: React.ElementType; action: React.ComponentProps<typeof Badge>["action"] }
  > = {
    [WorkoutExerciseSessionStatus.NOT_STARTED]: {
      icon: LucideBadgeIcon,
      action: "muted",
    },
    [WorkoutExerciseSessionStatus.IN_PROGRESS]: {
      icon: CircleStarIcon,
      action: "info",
    },
    [WorkoutExerciseSessionStatus.COMPLETED]: {
      icon: BadgeCheckIcon,
      action: "success",
    },
    [WorkoutExerciseSessionStatus.SKIPPED]: {
      icon: BadgeXIcon,
      action: "warning",
    },
  };

  return (
    <Badge
      size="sm"
      variant="solid"
      action={badgeStatus[status].action}
      className={cn("ml-1", className)}
    >
      <BadgeText>{status}</BadgeText>
      <BadgeIcon as={badgeStatus[status].icon} size="lg" className="ml-2" />
    </Badge>
  );
};

const ListElement = ({
  sessionExercise,
  index,
}: {
  sessionExercise: TrainingSessionWorkoutWithDetails;
  index: number;
}) => {
  return (
    <View className="my-0.5 ml-12 mr-8 flex-row gap-2 py-2.5">
      <Text className="text-lg font-black text-zinc-500">#{index + 1}</Text>
      <Text className="text-lg font-bold text-zinc-400 ">
        {sessionExercise.workoutExercise.exercise.name}
      </Text>
      <StatusBadge status={sessionExercise.status} className="ml-auto" />
    </View>
  );
};
