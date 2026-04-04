import { View, Text } from "react-native";
import React from "react";

import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { BackButton } from "@/components/back-button";

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  description: string;
  backButton?: boolean;
  icon: React.ComponentProps<typeof Icon>["as"];
}
export const ScreenHeader = ({
  title,
  subtitle,
  description,
  icon,
  backButton = false,
}: ScreenHeaderProps) => {
  return (
    <View className="px-4 pb-2 pt-6">
      <HStack className="justify-between">
        <HStack className="items-center gap-2">
          <Icon as={icon} className="text-amber-400" />
          <Text className="text-xs uppercase tracking-[0.22em] text-zinc-500">{description}</Text>
        </HStack>
        {backButton && <BackButton />}
      </HStack>
      <Heading
        size="2xl"
        className="mt-2 font-orbitron-semibold uppercase tracking-tight text-amber-400"
      >
        {title}
      </Heading>
      {subtitle && <Text className="mt-1 text-zinc-400">{subtitle}</Text>}
    </View>
  );
};
