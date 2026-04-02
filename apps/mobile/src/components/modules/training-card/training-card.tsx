import { ImageBackground, View } from "react-native";
import React from "react";
import { ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { type BaseTrainingSessionStats, TrainingSessionStatus } from "@repo/validators";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TrainingCardDayCounterBadge } from "@/components/modules/training-card/training-card-day-counter-badge";
import { TrainingCardStatusBadge } from "@/components/modules/training-card/training-card-status-badge";
import { TrainingCardSubtitle } from "@/components/modules/training-card/training-card-subtitle";

interface TrainingCardProps {
  imageUrl?: string;
  stats: BaseTrainingSessionStats;
  status?: TrainingSessionStatus;
  trainingName: string;
  className?: string;
  action?: {
    onPress: () => void;
    text: string;
    disabled?: boolean;
  };
}
const TrainingCard = ({
  imageUrl,
  stats,
  status,
  trainingName,
  className,
  action,
}: TrainingCardProps) => {
  return (
    <View
      className={cn("overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950", className)}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="relative flex h-56"
        imageStyle={{ borderRadius: 15 }}
      >
        <VStack className="relative z-10 flex-1 p-2">
          <HStack className="justify-between">
            <TrainingCardDayCounterBadge
              currentDay={stats.currentDay}
              totalDays={stats.totalDays}
              className="self-start"
              isStarted={status === TrainingSessionStatus.IN_PROGRESS}
            />
            <TrainingCardStatusBadge className="self-end" trainingSessionStatus={status} />
          </HStack>
          <VStack className="mt-auto">
            <TrainingCardSubtitle
              trainingSessionStatus={status}
              hasUserCompletedThisDay={stats.hasUserCompletedThisDay}
              onPress={action?.onPress}
              disabled={action?.disabled}
            />
            <Text className="font-orbitron-bold text-2xl uppercase tracking-widest text-amber-400">
              {trainingName}
            </Text>
            <View className={cn("opacity-100", { "opacity-0": !action })}>
              <Button
                disabled={!action || action?.disabled}
                className="mr-auto "
                variant="link"
                onPress={action?.onPress}
              >
                <Text className="text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
                  {action?.text}
                </Text>
                <Icon as={ChevronRight} size="sm" className="text-amber-400" />
              </Button>
            </View>
          </VStack>
        </VStack>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(251,191,36,0.4)",
            "rgba(251,191,36,1)",
            "rgba(251,191,36,0.4)",
            "transparent",
          ]}
          locations={[0, 0.2, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute bottom-0 h-[2px] w-full rounded-lg"
        />
      </ImageBackground>
    </View>
  );
};

export default TrainingCard;
