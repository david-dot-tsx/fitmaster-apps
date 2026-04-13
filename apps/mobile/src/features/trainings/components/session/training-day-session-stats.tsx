import { View, Text } from "react-native";
import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

interface TrainingDaySessionStatsProps {
  dominantPart: string;
  intensity: number;
  withWeight: number;
  total: number;
}
export const TrainingDaySessionStats = ({
  dominantPart,
  intensity,
  withWeight,
  total,
}: TrainingDaySessionStatsProps) => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <View className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3">
      <View className="flex-1 flex-row items-center justify-between gap-3 ">
        <StatItem label={t("focus")}>
          <Text
            className="text-center text-sm font-black uppercase tracking-tight text-amber-400"
            numberOfLines={1}
          >
            {dominantPart}
          </Text>
        </StatItem>

        <View className="mx-1 h-10 w-px bg-zinc-800" />

        <StatItem label={t("intensity")}>
          <View className="flex-row items-center justify-center gap-1">
            {[1, 2, 3].map((level) => (
              <View
                key={level}
                className={cn(
                  "h-1.5 max-w-[28px] flex-1 rounded-full",
                  level <= intensity ? "bg-amber-400" : "bg-zinc-800",
                )}
              />
            ))}
          </View>
        </StatItem>

        <View className="mx-1 h-10 w-px bg-zinc-800" />

        <StatItem label={t("weightUsage")}>
          <Text className="text-center text-sm font-black tabular-nums text-zinc-100">
            {withWeight} <Text className="text-zinc-600">/</Text> {total}
          </Text>
        </StatItem>
      </View>
    </View>
  );
};

const StatItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <View className="flex h-full flex-1 justify-between">
      <Text className="font-orbitron-semibold text-2xs text-center uppercase tracking-widest text-zinc-500">
        {label}
      </Text>
      <View className="flex-1 justify-center ">{children}</View>
    </View>
  );
};
