import React from "react";
import { Text, View } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

export const StatPill = ({
  label,
  value,
  subLabel,
  barClass,
  barProgress,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  barClass: string;
  barProgress: number;
}) => (
  <View className="w-[31%] min-w-[96px] shrink-0 p-1 sm:w-auto">
    <Text className="font-orbitron-medium text-2xs uppercase tracking-widest text-zinc-500">
      {label}
    </Text>
    <View className="mt-0.5 flex-row items-baseline gap-1">
      <Text className="font-orbitron-semibold text-xl tabular-nums tracking-tighter text-zinc-100">
        {value}
      </Text>
      {subLabel ? (
        <Text className="text-2xs font-bold uppercase text-zinc-600">{subLabel}</Text>
      ) : null}
    </View>
    <View className="relative mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800/60">
      <View
        className={cn("h-full rounded-full", barClass)}
        style={{ width: `${Math.min(100, Math.max(0, barProgress))}%` }}
      />
    </View>
  </View>
);
