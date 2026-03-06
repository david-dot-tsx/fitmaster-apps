import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

interface ProgressBarProps {
  currentValue: number;
  maxValue: number;
  className?: string;
}
const getPercentageCurrentValue = (currentValue: number, maxValue: number) => {
  if (currentValue === maxValue) return 100;
  if (currentValue === 0) return 5;

  return (currentValue / maxValue) * 100;
};

export const ProgressBar = ({ currentValue, maxValue, className }: ProgressBarProps) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(getPercentageCurrentValue(currentValue, maxValue), {
      damping: 20,
      stiffness: 90,
    });
  }, [currentValue, maxValue, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className={cn("flex-1", className)}>
      <View className="h-4 w-full overflow-hidden rounded-full bg-zinc-800">
        <Animated.View style={animatedStyle} className="h-full bg-amber-400" />
      </View>
    </View>
  );
};
