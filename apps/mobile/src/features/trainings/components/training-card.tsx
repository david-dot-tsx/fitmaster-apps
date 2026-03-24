import React from "react";
import { ImageBackground, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@/components/ui/text";

type TrainingCardProps = {
  id: string;
  title: string;
  imageUrl: string | null;
  onPress?: () => void;
};

export const TrainingCard = ({ title, imageUrl, onPress }: TrainingCardProps) => (
  <Pressable
    onPress={onPress}
    className="mx-4 mb-4 overflow-hidden rounded-2xl border border-zinc-800"
    style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
  >
    <ImageBackground
      source={imageUrl ? { uri: imageUrl } : undefined}
      className="relative h-56 justify-end"
      imageStyle={{ borderRadius: 15 }}
    >
      {!imageUrl && <View className="absolute inset-0 rounded-2xl bg-zinc-900" />}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.92)"]}
        locations={[0, 0.65, 1]}
        className="absolute inset-0"
      />

      {/* Amber accent line */}
      <View className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400/60" />

      <View className="relative px-4 pb-5">
        <Text
          className="text-xl font-black uppercase italic tracking-tighter text-amber-400"
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </ImageBackground>
  </Pressable>
);
