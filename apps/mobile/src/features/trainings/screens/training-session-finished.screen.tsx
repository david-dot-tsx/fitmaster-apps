import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

import { useT } from "@/lib/i18n";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

//TODO: add stats
export const TrainingSessionFinishedScreen = (_props: {
  trainingId: string;
  sessionId: string;
}) => {
  const { t } = useT();

  return (
    <ScreenWrapper>
      <VStack className="flex-1 items-center justify-center gap-4">
        <Heading size="2xl" className="uppercase tracking-tighter">
          {t("trainingFinished")}
          <Text className="text-zinc-200">!</Text>
        </Heading>
        <View>
          <Text className="text-center text-zinc-400">{t("stats")}</Text>
        </View>
        <Button
          size="lg"
          className="bg-amber-400 font-bold tracking-widest text-zinc-950"
          onPress={() => router.replace("/main")}
        >
          <ButtonText>{t("getBackToMainScreen")}</ButtonText>
        </Button>
      </VStack>
    </ScreenWrapper>
  );
};
