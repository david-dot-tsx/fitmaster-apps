import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";

export const OnboardingCompletedScreen = () => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <ScreenWrapper className="flex-1 bg-zinc-950">
      <View className="flex-1 items-center justify-center gap-6 px-8">
        <Icon as={CheckCircle2} size="4xl" className="text-amber-400" />
        <View className="items-center gap-2">
          <Heading size="3xl" className="text-center">
            {t("mobile:screens.onboarding.steps.completed.title")}
          </Heading>
          <Text size="md" className="text-typography-500 text-center">
            {t("mobile:screens.onboarding.steps.completed.description")}
          </Text>
        </View>
        <Button className="mt-4 w-full" size="xl" onPress={() => router.replace("/main")}>
          <ButtonText>{t("mobile:screens.onboarding.steps.completed.button")}</ButtonText>
        </Button>
      </View>
    </ScreenWrapper>
  );
};
