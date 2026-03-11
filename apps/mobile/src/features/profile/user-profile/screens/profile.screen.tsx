import React from "react";

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
    <ScreenWrapper className="pt-12">
      <Text>Loading...</Text>
    </ScreenWrapper>
  );
};
