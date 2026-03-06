import React from "react";
import { View } from "react-native";

import { VStack } from "@/components/ui/vstack";
import { FormWheelPicker } from "@/components/form/form-wheel-picker";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

const weights = [...Array(100).keys()].map((index) => ({
  value: index + 30,
  label: (index + 30).toString(),
}));

const heights = [...Array(120).keys()].map((index) => ({
  value: index + 100,
  label: (index + 100).toString(),
}));

export const StepBodyMeasurements = () => {
  return (
    <StepWrapper title="Body Measurements">
      <VStack className="flex flex-1 justify-center gap-16">
        <View className="flex w-full flex-row justify-center gap-12">
          <FormWheelPicker name="weight" label="Weight" data={weights} unit="kg" />
          <FormWheelPicker name="height" label="Height" data={heights} unit="cm" />
        </View>
      </VStack>
    </StepWrapper>
  );
};
