import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";

export const OnboardingCompletedScreen = () => {
  return (
    <ScreenWrapper className="flex-1 bg-zinc-950">
      <View className="flex-1 items-center justify-center gap-6 px-8">
        <Icon as={CheckCircle2} size="4xl" className="text-amber-400" />
        <View className="items-center gap-2">
          <Heading size="3xl" className="text-center text-amber-400">
            You&apos;re all set!
          </Heading>
          <Text size="md" className="text-center text-typography-500">
            Your profile has been created. Time to start your fitness journey.
          </Text>
        </View>
        <Button className="mt-4 w-full" size="xl" onPress={() => router.replace("/main")}>
          <ButtonText>Let&apos;s Go</ButtonText>
        </Button>
      </View>
    </ScreenWrapper>
  );
};
