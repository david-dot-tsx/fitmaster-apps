import React from "react";
import { View } from "react-native";
import { UserIcon } from "lucide-react-native";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Profile } from "@/features/profile/user-profile/components/profile";

export const ProfileScreen = ({ nickname }: { nickname: string }) => {
  const { data: profile, status } = trpc.profile.getCustomerProfile.useQuery({ nickname });

  const { data: me } = trpc.user.me.useQuery();

  const isMyProfile = me?.profile?.id === profile?.userId;

  if (status === "success" && profile) {
    return <Profile profile={profile} isMyProfile={isMyProfile} />;
  }

  return (
    <ScreenWrapper
      header={{
        title: "User Profile",
        description: "Profile",
        subtitle: "Loading profile details...",
        icon: UserIcon,
      }}
    >
      <View className="mx-4 mt-10 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
        <Text className="text-center text-zinc-400">Loading...</Text>
      </View>
    </ScreenWrapper>
  );
};
