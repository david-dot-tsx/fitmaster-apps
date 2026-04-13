import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import TrainingCard from "@/components/modules/training-card/training-card";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";

const LIMIT = 25;

export const TrainingListScreen = () => {
  const router = useRouter();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch, isFetching } =
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

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.trainingList.title"),
        description: t("mobile:screens.trainingList.description"),
        subtitle: t("mobile:screens.trainingList.subtitle"),
        icon: DumbbellIcon,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && <QueryErrorHandler refetch={refetch} isFetching={isFetching} />}
      {status === "success" && (
        <FlatList
          data={data?.pages.flat()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrainingCard
              imageUrl={item.imageUrl ?? undefined}
              stats={
                item.trainingSessions[0]?.stats ?? {
                  totalDays: item.totalDays,
                  currentDay: 1,
                  hasUserCompletedThisDay: false,
                }
              }
              className="my-2.5"
              trainingName={item.name}
              status={item.trainingSessions[0]?.status}
              action={{
                onPress: () => router.push(`/training/${item.id}`),
                text: t("goToTrainingDetails"),
              }}
            />
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="mx-4 mt-14 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
              <Text className="text-center text-zinc-400">
                {t("noTrainingsPublishedYet")} {"\n"} {t("pleaseCheckBackSoon")}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </ScreenWrapper>
  );
};
