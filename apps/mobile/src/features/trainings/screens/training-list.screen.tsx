import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Heading } from "@/components/ui/heading";

import { TrainingCard } from "../components/training-card";

const LIMIT = 25;

type Training = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export const TrainingListScreen = () => {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.training.listPublished.useInfiniteQuery(
      { limit: LIMIT },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.length < LIMIT) return undefined;
          const last = lastPage.at(-1);
          if (!last) return undefined;

          return last.id;
        },
      },
    );

  const trainings = useMemo<Training[]>(() => {
    if (!data) return [];

    return data.pages.flat();
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="items-center py-4">
        <ActivityIndicator color="#fbbf24" />
      </View>
    );
  };

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
        Trainings
      </Heading>
      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainingCard
            id={item.id}
            title={item.name}
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/training/${item.id}`)}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScreenWrapper>
  );
};
