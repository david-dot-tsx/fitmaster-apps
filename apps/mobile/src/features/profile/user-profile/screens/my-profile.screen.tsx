import React from "react";
import { ActivityIndicator } from "react-native";
import { UserIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Profile } from "@/features/profile/user-profile/components/profile";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";

export const MyProfileScreen = () => {
  const { data: me } = trpc.user.me.useQuery();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  const {
    data: profile,
    status,
    refetch,
    isFetching,
  } = trpc.profile.getCustomerProfile.useQuery({ userId: me?.id }, { enabled: !!me?.id });

  if (status === "success") {
    return <Profile profile={profile} isMyProfile />;
  }

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.profile.loading.myProfile.title"),
        description: t("mobile:screens.profile.loading.myProfile.description"),
        subtitle: t("mobile:screens.profile.loading.myProfile.subtitle"),
        icon: UserIcon,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && <QueryErrorHandler refetch={refetch} isFetching={isFetching} />}
    </ScreenWrapper>
  );
};
