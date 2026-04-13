import { ScrollView } from "react-native";
import React, { useState } from "react";
import { differenceInCalendarYears } from "date-fns";
import { SettingsIcon, UserIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import type { CustomerProfileGetOutput } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FoldableText } from "@/components/foldable-text";
import { Button, ButtonIcon } from "@/components/ui/button";
import LeaderboardPosition from "@/features/profile/user-profile/components/leaderboard-position";
import { SettingsSheet } from "@/features/settings/components/settings-sheet";
import { Section } from "@/components/ui/section";

export const Profile = ({
  profile,
  isMyProfile,
}: {
  profile: CustomerProfileGetOutput;
  isMyProfile: boolean;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <ScreenWrapper
      header={{
        title: profile.nickname,
        description: isMyProfile
          ? t("mobile:screens.profile.myProfile.description")
          : t("mobile:screens.profile.userProfile.description"),
        subtitle: isMyProfile
          ? t("mobile:screens.profile.myProfile.subtitle")
          : t("mobile:screens.profile.userProfile.subtitle"),
        icon: UserIcon,
        backButton: !isMyProfile,
      }}
    >
      <ScrollView className="px-4 py-8">
        <VStack className="gap-4">
          <HStack className="gap-4">
            <Avatar size="xl">
              <AvatarImage source={{ uri: profile?.imageUrl ?? undefined }} />
            </Avatar>
            <VStack className="flex-1 justify-center">
              <Text className="text-zinc-300">
                {profile?.firstName && `${profile?.firstName}, `}
                {profile?.birthDate &&
                  differenceInCalendarYears(new Date(), profile.birthDate)}{" "}
                <Text className="text-zinc-500">{t("yo")}.</Text>
              </Text>
              <LeaderboardPosition nickname={profile?.nickname ?? ""} />

              {/* //TODO: add profile stats there, nickname and age move to the header*/}
            </VStack>
            {isMyProfile && (
              <Button
                action="secondary"
                variant="outline"
                size="md"
                className="ml-auto aspect-square rounded-xl px-0"
                onPress={() => setIsSettingsOpen(true)}
              >
                <ButtonIcon as={SettingsIcon} size={"xl"} className="text-amber-400/60" />
              </Button>
            )}
          </HStack>
          <Section title={t("bio")}>
            <FoldableText text={profile?.bio ?? "—"} />
          </Section>
          <Section title={t("goals")}>
            <FoldableText text={profile?.customerProfile.goal ?? "—"} />
          </Section>
          {/* //TODO: add current trainings */}
          <Section title={t("currentTrainings")}>—</Section>
          {/* //TODO: add finished trainings */}
          <Section title={t("finishedTrainings")}>—</Section>
        </VStack>
      </ScrollView>
      <SettingsSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </ScreenWrapper>
  );
};
