import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import { differenceInCalendarYears } from "date-fns";
import { SettingsIcon } from "lucide-react-native";

import type { CustomerProfileGetOutput } from "@repo/validators";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FoldableText } from "@/components/foldable-text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { BackButton } from "@/components/back-button";
import LeaderboardPosition from "@/features/profile/user-profile/components/leaderboard-position";
import { SettingsSheet } from "@/features/settings/components/settings-sheet";

export const Profile = ({
  profile,
  isMyProfile,
}: {
  profile: CustomerProfileGetOutput;
  isMyProfile: boolean;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <View className="flex-1">
      <ScreenWrapper className="pt-12">
        {!isMyProfile && <BackButton className="ml-4 mt-4" />}
        <ScrollView className="px-4 py-8">
          <VStack className="gap-4">
            <HStack className="gap-4">
              <Avatar size="xl">
                <AvatarImage source={{ uri: profile?.imageUrl ?? undefined }} />
              </Avatar>
              <VStack>
                <Heading className="text-2xl font-bold text-amber-400">{profile?.nickname}</Heading>
                <Text className="text-zinc-300">
                  {profile?.firstName},{" "}
                  {profile?.birthDate && differenceInCalendarYears(new Date(), profile.birthDate)}
                </Text>
                <LeaderboardPosition nickname={profile?.nickname ?? ""} />
              </VStack>
              {isMyProfile && (
                <Button
                  action="primary"
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onPress={() => setIsSettingsOpen(true)}
                >
                  <Icon as={SettingsIcon} size={"xl"} color="white" />
                </Button>
              )}
            </HStack>
            <FoldableText label="bio" text={profile?.bio ?? ""} />
            <FoldableText label="goals" text={profile?.customerProfile.goal ?? ""} />
          </VStack>
        </ScrollView>
      </ScreenWrapper>

      <SettingsSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </View>
  );
};
