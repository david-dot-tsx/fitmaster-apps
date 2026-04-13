import React from "react";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

type MyPositionCardProps = {
  position: number;
  nickname: string;
  points: number;
};

export const MyPositionCard = ({ position, nickname, points }: MyPositionCardProps) => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <VStack className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400/70">
        {t("yourPosition")}
      </Text>
      <HStack className="items-center">
        <Text className="w-10 text-sm font-bold text-amber-400">#{position}</Text>
        <Text className="flex-1 text-sm font-semibold text-amber-400">{nickname}</Text>
        <Text className="text-sm text-zinc-400">
          {points.toLocaleString()} {t("pts")}
        </Text>
      </HStack>
    </VStack>
  );
};
