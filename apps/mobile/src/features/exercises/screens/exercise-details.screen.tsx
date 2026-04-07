import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { DumbbellIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Section } from "@/components/ui/section";
import { VStack } from "@/components/ui/vstack";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";
import { ContentHero } from "@/components/modules/content-hero/content-hero";
import { ExerciseMeta } from "@/features/exercises/components/exercise-meta";
import { FoldableText } from "@/components/foldable-text";

export const ExerciseDetailsScreen = ({ id }: { id: string }) => {
  const { data: exercise, status, refetch, isFetching } = trpc.exercise.getById.useQuery({ id });

  return (
    <ScreenWrapper
      header={{
        title: exercise?.name ?? "Exercise details",
        description: "Exercise library",
        subtitle: "Technique, traits, and difficulty.",
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && (
        <View className="flex-1 justify-center px-4">
          <QueryErrorHandler refetch={refetch} isFetching={isFetching} />
        </View>
      )}
      {status === "success" && exercise != null && (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
            paddingHorizontal: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <ContentHero className="mt-1" imageUrl={exercise.imageUrl} />
          <VStack className="gap-4 pb-6 pt-4">
            <ExerciseMeta difficulty={exercise.difficulty} bodyPart={exercise.bodyPart} />

            <Section title="Description">
              {exercise.description && exercise.description.length > 0 ? (
                <FoldableText text={exercise.description} />
              ) : (
                <Text className="text-zinc-400">No description provided for this exercise.</Text>
              )}
            </Section>
          </VStack>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};
