import React from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";

import { Text } from "@/components/ui/text";
import { trpc } from "@/lib/trpc/client";

const LeaderboardPosition = ({ nickname }: { nickname: string }) => {
  const { data: position } = trpc.leaderboard.getPosition.useQuery({ nickname });
  if (!position) return null;

  return (
    <Pressable onPress={() => router.push("/main/leaderboard")}>
      <Text className="font-bold text-zinc-400">
        #{position.position} - {position.points.toLocaleString()} pts
      </Text>
    </Pressable>
  );
};

export default LeaderboardPosition;
