import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Heading } from "@/components/ui/heading";

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
  const { data: me } = trpc.user.me.useQuery();

  const { data: myProfile } = trpc.profile.getCustomerProfile.useQuery(
    { userId: me!.id },
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.leaderboard.list.useInfiniteQuery(
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
        Leaderboard
      </Heading>
      {myPosition && (
        <MyPositionCard
          position={myPosition.position}
          nickname={myPosition.nickname}
          points={myPosition.points}
        />
      )}
      <FlatList
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
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScreenWrapper>
  );
};
