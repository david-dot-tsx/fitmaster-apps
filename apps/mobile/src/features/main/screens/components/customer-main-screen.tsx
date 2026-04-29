import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { SparklesIcon } from "lucide-react-native";

import { type TrainingSessionMyTrainingsItem, TrainingSessionStatus } from "@repo/validators";

import { useT } from "@/lib/i18n";
import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import TrainingCard from "@/components/modules/training-card/training-card";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";

type CustomerMainScreenProps = {
  nickname?: string | null;
};

export const CustomerMainScreen = ({ nickname }: CustomerMainScreenProps) => {
  const router = useRouter();
  const { t } = useT();
  const {
    data: myTrainings,
    status: myTrainingsStatus,
    isFetching,
    refetch: refetchMyTrainings,
  } = trpc.training.session.myTrainings.useQuery();

  const getCardAction = useCallback(
    (
      trainingSession: TrainingSessionMyTrainingsItem,
    ): { onPress: () => void; text: string } | undefined => {
      if (trainingSession.status === TrainingSessionStatus.COMPLETED) {
        return {
          onPress: () => router.push(`/training/${trainingSession.training.id}`),
          text: t("goToTrainingDetails"),
        };
      }

      return {
        onPress: () =>
          router.push(`/training/${trainingSession.training.id}/session/${trainingSession.id}`),
        text: t("startTrainingDay"),
      };
    },
    [router, t],
  );

  return (
    <ScreenWrapper
      className="gap-4"
      header={{
        title: `${t("mobile:screens.main.title")} ${nickname ?? ""}!`,
        description: t("mobile:screens.main.description"),
        subtitle: t("mobile:screens.main.subtitle"),
        icon: SparklesIcon,
      }}
    >
      {myTrainingsStatus === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {myTrainingsStatus === "error" && (
        <QueryErrorHandler refetch={refetchMyTrainings} isFetching={isFetching} />
      )}
      {myTrainingsStatus === "success" && (
        <FlatList
          data={myTrainings ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrainingCard
              imageUrl={item.training.imageUrl ?? ""}
              stats={item.stats}
              status={item.status}
              trainingName={item.training.name}
              className="my-2.5"
              action={getCardAction(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mx-4 mt-14 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
              <Text className="text-center text-zinc-400">
                {t("youHaveNotJoinedAnyTrainingsYet")} {"\n"}
                {t("browseTrainingsToGetStarted")}
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};
