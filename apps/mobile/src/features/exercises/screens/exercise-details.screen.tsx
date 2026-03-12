import React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";

import { ExerciseHero } from "../components/exercise-hero";
import { ExerciseMeta } from "../components/exercise-meta";
import { ExerciseDescription } from "../components/exercise-description";

export const ExerciseDetailsScreen = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: exercise, isLoading, isError } = trpc.exercise.getById.useQuery({ id });

  if (isLoading) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </ScreenWrapper>
    );
  }

  if (isError || !exercise) {
    return (
      <ScreenWrapper className="items-center justify-center px-8">
        <Text className="text-center text-zinc-400">Exercise not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 rounded-xl bg-amber-400 px-6 py-3">
          <Text className="font-bold text-zinc-950">Go back</Text>
        </Pressable>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ExerciseHero imageUrl={exercise.imageUrl} />

        <View className="px-4 pt-6">
          <Heading
            size="2xl"
            className="mb-1 font-black uppercase italic tracking-tighter text-amber-400"
          >
            {exercise.name}
          </Heading>

          <ExerciseMeta difficulty={exercise.difficulty} bodyPart={exercise.bodyPart} />

          {exercise.description ? <ExerciseDescription description={exercise.description} /> : null}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
