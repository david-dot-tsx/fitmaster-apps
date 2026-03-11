import React from "react";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Profile } from "@/features/profile/user-profile/components/profile";
import { Text } from "@/components/ui/text";

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
    <ScreenWrapper className="pt-12">
      <Text>Loading...</Text>
    </ScreenWrapper>
  );
};
