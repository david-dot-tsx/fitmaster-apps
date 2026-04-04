import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { DumbbellIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Section } from "@/components/ui/section";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";
import { ExerciseHero } from "@/features/exercises/components/exercise-hero";
import { ExerciseMeta } from "@/features/exercises/components/exercise-meta";

export const ExerciseDetailsScreen = ({ id }: { id: string }) => {
  const { data: exercise, status, refetch, isFetching } = trpc.exercise.getById.useQuery({ id });

  return (
    <ScreenWrapper
      header={{
        title: exercise?.name ?? "Exercise details",
        description: "Exercise",
        subtitle: "Exercise details",
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && <QueryErrorHandler refetch={refetch} isFetching={isFetching} />}
      {status === "success" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <ExerciseHero imageUrl={exercise.imageUrl} />

          <View className="px-4 pt-6">
            <ExerciseMeta difficulty={exercise.difficulty} bodyPart={exercise.bodyPart} />

            <Section title="Description">
              <Text className="text-zinc-300">
                {exercise.description && exercise.description.length > 0
                  ? exercise.description
                  : "No description provided for this exercise."}
              </Text>
            </Section>
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};
