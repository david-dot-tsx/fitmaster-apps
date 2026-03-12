import React from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";

type TrainingDescriptionProps = {
  description: string;
};

export const TrainingDescription = ({ description }: TrainingDescriptionProps) => (
  <View className="mb-6">
    <Heading size="sm" className="mb-2 uppercase tracking-widest text-zinc-400">
      About
    </Heading>
    <Text className="leading-6 text-zinc-300">{description}</Text>
  </View>
);
