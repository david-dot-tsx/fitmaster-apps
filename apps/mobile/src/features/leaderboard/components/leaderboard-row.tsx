import React from "react";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

type LeaderboardRowProps = {
  customerProfileId: string;
  nickname: string;
  points: number;
  position: number;
  isCurrentUser: boolean;
};

export const LeaderboardRow = ({ position, nickname, points, isCurrentUser }: LeaderboardRowProps) => (
  <HStack
    className={[
      "items-center border-b border-zinc-800 px-4 py-3",
      isCurrentUser ? "bg-amber-400/10" : "",
    ].join(" ")}
  >
    <Text
      className={["w-10 text-sm", isCurrentUser ? "text-amber-400" : "text-zinc-500"].join(" ")}
    >
      #{position}
    </Text>
    <Text className="flex-1 text-sm font-semibold text-amber-400">{nickname}</Text>
    <Text className="text-sm text-zinc-400">{points.toLocaleString()} pts</Text>
  </HStack>
);
