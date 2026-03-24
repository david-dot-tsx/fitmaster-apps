import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { EnrolledTrainingCard } from "@/features/main/components/enrolled-training-card";

export const MainScreen = () => {
  const router = useRouter();
  const { data: myTrainings, isLoading } = trpc.training.session.myTrainings.useQuery();

  if (isLoading) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="pt-12">
      <Heading size="xl" className="px-4 pb-4 pt-6 text-center text-amber-400">
        Hello XYZ!
      </Heading>

      <FlatList
        data={myTrainings ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnrolledTrainingCard
            trainingSession={item}
            onPress={() => router.push(`/training/${item.training.id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center px-8 pt-16">
            <Text className="text-center text-zinc-500">
              You have not joined any trainings yet.{"\n"}Browse trainings to get started!
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};
