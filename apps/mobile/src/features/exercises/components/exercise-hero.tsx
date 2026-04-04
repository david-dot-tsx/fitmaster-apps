import React from "react";
import { Image, View } from "react-native";
import { DumbbellIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";

type ExerciseHeroProps = {
  imageUrl: string;
};

export const ExerciseHero = ({ imageUrl }: ExerciseHeroProps) => (
  <View className="relative h-72 w-full bg-zinc-900">
    <Image source={{ uri: imageUrl }} className="size-full" resizeMode="cover" />

    {imageUrl ? null : (
      <View className="absolute inset-0 items-center justify-center">
        <Icon as={DumbbellIcon} size="xl" color="#52525b" />
      </View>
    )}

    {/* Gradient overlay */}
    <View className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80" />
  </View>
);
