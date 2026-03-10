import { ScrollView } from "react-native";
import React from "react";
import { differenceInCalendarYears } from "date-fns";

import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FoldableText } from "@/components/foldable-text";

export const MyProfileScreen = () => {
  const { data: myProfile, status } = trpc.profile.getCustomerMyProfile.useQuery();

  return (
    <ScreenWrapper className="pt-12">
      <ScrollView className="px-4 py-8">
        <VStack>
          <HStack className="gap-4">
            <Avatar size="xl">
              <AvatarImage source={{ uri: myProfile?.imageUrl ?? undefined }} />
            </Avatar>
            <VStack>
              <Heading className="text-2xl font-bold text-amber-400">{myProfile?.nickname}</Heading>
              {status === "success" && (
                <Text>
                  {myProfile?.firstName},{" "}
                  {differenceInCalendarYears(new Date(), myProfile?.birthDate)}
                </Text>
              )}
            </VStack>
          </HStack>
          <FoldableText label="bio" text={myProfile?.bio ?? ""} />
          <FoldableText label="goals" text={myProfile?.customerProfile.goal ?? ""} />
        </VStack>
      </ScrollView>
    </ScreenWrapper>
  );
};
