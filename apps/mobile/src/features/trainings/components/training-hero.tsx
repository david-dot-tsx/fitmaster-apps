import React from "react";
import { Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, DumbbellIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";

type TrainingHeroProps = {
  imageUrl: string | null;
};

export const TrainingHero = ({ imageUrl }: TrainingHeroProps) => {
  const router = useRouter();

  return (
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

      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute left-4 top-12 rounded-full bg-zinc-900/70 p-2"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Icon as={ArrowLeftIcon} size="md" color="#fbbf24" />
      </Pressable>
    </View>
  );
};
