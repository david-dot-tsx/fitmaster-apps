import React from "react";
import { Pressable, View, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { type TrainingSessionMyTrainingsOutput } from "@repo/validators";

import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

type EnrolledTrainingCardProps = {
  trainingSession: NonNullable<TrainingSessionMyTrainingsOutput[number]>;
  onPress?: () => void;
};

export const EnrolledTrainingCard = ({ trainingSession, onPress }: EnrolledTrainingCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-4 overflow-hidden rounded-2xl border border-zinc-800"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <ImageBackground
        source={
          trainingSession.training.imageUrl ? { uri: trainingSession.training.imageUrl } : undefined
        }
        className="relative h-56"
        imageStyle={{ borderRadius: 15 }}
      >
        {!trainingSession.training.imageUrl && (
          <View className="absolute inset-0 rounded-2xl bg-zinc-900" />
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.92)"]}
          locations={[0, 0.65, 1]}
          className="absolute inset-0"
        />

        {/* Amber accent line */}
        <View className="absolute inset-x-0 top-0 h-0.5 bg-amber-400/60" />

        <View className="relative px-4 pt-3">
          <Text
            className="text-2xl font-black uppercase italic tracking-tighter text-amber-400"
            numberOfLines={2}
          >
            {trainingSession.training.name}
          </Text>
        </View>
        <Button
          className="mt-auto bg-amber-400"
          onPress={() =>
            router.push(`/training/${trainingSession.training.id}/session/${trainingSession.id}`)
          }
        >
          <ButtonText className="text-sm font-bold uppercase tracking-widest text-black">
            GO TO TRAINING
          </ButtonText>
        </Button>
      </ImageBackground>
    </Pressable>
  );
};
