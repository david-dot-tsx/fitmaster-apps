import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { SparklesIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import TrainingCard from "@/components/modules/training-card/training-card";

export const MainScreen = () => {
  const router = useRouter();
  const { data: myTrainings, isLoading } = trpc.training.session.myTrainings.useQuery();
  const { data: me } = trpc.user.me.useQuery();
  if (isLoading) {
    return (
      <ScreenWrapper className="items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      className="gap-4"
      header={{
        title: `Hello ${me?.profile?.nickname ?? ""}!`,
        description: "Your training hub",
        subtitle: "Jump back into your active plans and sessions.",
        icon: SparklesIcon,
      }}
    >
      <FlatList
        data={myTrainings ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainingCard
            imageUrl={item.training.imageUrl ?? ""}
            stats={item.stats}
            status={item.status}
            trainingName={item.training.name}
            action={{
              onPress: () => router.push(`/training/${item.training.id}/session/${item.id}`),
              text: "Start training day",
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mx-4 mt-14 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
            <Text className="text-center text-zinc-400">
              You have not joined any trainings yet.{"\n"}Browse trainings to get started!
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};
