import React from "react";
import { View } from "react-native";
import { UserIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Profile } from "@/features/profile/user-profile/components/profile";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

export const MyProfileScreen = () => {
  const { data: me } = trpc.user.me.useQuery();

  const { data: profile, status } = trpc.profile.getCustomerProfile.useQuery(
    { userId: me?.id },
    { enabled: !!me?.id },
  );

  if (status === "success" && profile) {
    return <Profile profile={profile} isMyProfile />;
  }

  return (
    <ScreenWrapper>
      <View className="px-4 pb-2 pt-6">
        <HStack className="items-center gap-2">
          <Icon as={UserIcon} className="text-amber-400" />
          <Text className="text-xs uppercase tracking-[0.22em] text-zinc-500">Profile</Text>
        </HStack>
        <Heading
          size="2xl"
          className="mt-2 font-orbitron-semibold uppercase tracking-tight text-amber-400"
        >
          My Profile
        </Heading>
        <Text className="mt-1 text-zinc-400">Loading profile details...</Text>
      </View>

      <View className="mx-4 mt-10 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
        <Text className="text-center text-zinc-400">Loading...</Text>
      </View>
    </ScreenWrapper>
  );
};
