import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { TrophyIcon } from "lucide-react-native";

import { useT } from "@/lib/i18n";
import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";

import { LeaderboardRow } from "../components/leaderboard-row";
import { MyPositionCard } from "../components/my-position-card";

const LIMIT = 25;

type LeaderboardEntry = {
  customerProfileId: string;
  nickname: string;
  points: number;
  position: number;
};

export const LeaderboardScreen = () => {
  const { t } = useT();
  const { data: me } = trpc.user.me.useQuery();
  const { data: myProfile } = trpc.profile.getCustomerProfile.useQuery(
    { userId: me?.id },
    { enabled: !!me?.id },
  );

  const { data: myPosition } = trpc.leaderboard.getPosition.useQuery(
    {
      nickname: myProfile?.nickname ?? "",
    },
    {
      enabled: !!myProfile?.nickname,
    },
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: leaderboardStatus,
    refetch: refetchLeaderboard,
    isFetching: isFetchingLeaderboard,
  } = trpc.leaderboard.list.useInfiniteQuery(
    { limit: LIMIT },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < LIMIT) return undefined;
        const last = lastPage.at(-1);
        if (!last) return undefined;

        return last.customerProfileId;
      },
    },
  );

  const entries = useMemo<LeaderboardEntry[]>(() => {
    if (!data) return [];

    return data.pages.flatMap((page, pageIndex) =>
      page.map((entry, itemIndex) => ({
        ...entry,
        position: pageIndex * LIMIT + itemIndex + 1,
      })),
    );
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

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.leaderboard.title"), //"Leaderboard",
        description: t("mobile:screens.leaderboard.description"), //"Compete",
        subtitle: t("mobile:screens.leaderboard.subtitle"), //"See who leads and where you rank today.",
        icon: TrophyIcon,
      }}
    >
      {myPosition && (
        <MyPositionCard
          position={myPosition.position}
          nickname={myPosition.nickname}
          points={myPosition.points}
        />
      )}

      {leaderboardStatus === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {leaderboardStatus === "error" && (
        <QueryErrorHandler refetch={refetchLeaderboard} isFetching={isFetchingLeaderboard} />
      )}
      {leaderboardStatus === "success" && (
        <FlatList
          className="flex-1 px-2"
          data={entries}
          keyExtractor={(item) => item.customerProfileId}
          renderItem={({ item }) => (
            <LeaderboardRow
              {...item}
              isCurrentUser={item.customerProfileId === myPosition?.customerProfileId}
            />
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="mx-4 mt-10 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
              <Text className="text-center text-zinc-400">
                {t("noLeaderboardEntriesYet")} {"\n"} {t("beTheFirstToScorePoints")}
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
