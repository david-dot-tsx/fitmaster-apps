import React from "react";
import { Image, View } from "react-native";
import { DumbbellIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";

type TrainingHeroProps = {
  imageUrl: string | null;
};

export const TrainingHero = ({ imageUrl }: TrainingHeroProps) => (
  <View className="overflow-hidden rounded-xl">
    <View className="relative h-64 w-full bg-zinc-900">
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className="size-full" resizeMode="cover" />
      ) : (
        <View className="absolute inset-0 items-center justify-center">
          <Icon as={DumbbellIcon} size="xl" color="#52525b" />
        </View>
      )}

      {/* Gradient overlay */}
      <View className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80" />
    </View>
  </View>
);
