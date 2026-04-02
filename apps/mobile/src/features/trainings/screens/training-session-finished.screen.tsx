import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

//TODO: add stats
export const TrainingSessionFinishedScreen = (_props: {
  trainingId: string;
  sessionId: string;
}) => {
  return (
    <ScreenWrapper>
      <VStack className="flex-1 items-center justify-center gap-4">
        <Heading size="2xl" className="uppercase tracking-tighter">
          Training Finished<Text className="text-zinc-200">!</Text>
        </Heading>
        <View>
          <Text className="text-center text-zinc-400">Stats</Text>
        </View>
        <Button
          size="lg"
          className="bg-amber-400 font-bold tracking-widest text-zinc-950"
          onPress={() => router.replace("/main")}
        >
          <ButtonText>Get Back To Main Screen</ButtonText>
        </Button>
      </VStack>
    </ScreenWrapper>
  );
};
