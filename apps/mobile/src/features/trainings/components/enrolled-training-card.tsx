import React from "react";
import { Pressable, View } from "react-native";
import { CalendarClockIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";

type EnrolmentStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type EnrolledTrainingCardProps = {
  trainingId: string;
  status: EnrolmentStatus;
  enrolledAt: Date;
  onPress?: () => void;
};

const STATUS_LABEL: Record<EnrolmentStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<EnrolmentStatus, string> = {
  NOT_STARTED: "text-zinc-400",
  IN_PROGRESS: "text-amber-400",
  COMPLETED: "text-emerald-400",
  CANCELLED: "text-red-400",
};

const STATUS_DOT: Record<EnrolmentStatus, string> = {
  NOT_STARTED: "bg-zinc-400",
  IN_PROGRESS: "bg-amber-400",
  COMPLETED: "bg-emerald-400",
  CANCELLED: "bg-red-400",
};

export const EnrolledTrainingCard = ({
  trainingId,
  status,
  enrolledAt,
  onPress,
}: EnrolledTrainingCardProps) => (
  <Pressable
    onPress={onPress}
    className="mx-4 mb-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
  >
    <View className="absolute inset-x-0 top-0 h-0.5 bg-amber-400/40" />

    <View className="p-4">
      <HStack className="items-center justify-between">
        <Text
          className="flex-1 font-black uppercase italic tracking-tighter text-zinc-100"
          numberOfLines={1}
        >
          #{trainingId.slice(0, 8).toUpperCase()}
        </Text>

        <HStack className="items-center gap-1.5">
          <View className={`size-2 rounded-full ${STATUS_DOT[status]}`} />
          <Text className={`text-xs font-semibold ${STATUS_COLOR[status]}`}>
            {STATUS_LABEL[status]}
          </Text>
        </HStack>
      </HStack>

      <HStack className="mt-2 items-center gap-1.5">
        <Icon as={CalendarClockIcon} size="xs" color="#71717a" />
        <Text className="text-xs text-zinc-500">
          Enrolled {new Date(enrolledAt).toLocaleDateString()}
        </Text>
      </HStack>
    </View>
  </Pressable>
);
