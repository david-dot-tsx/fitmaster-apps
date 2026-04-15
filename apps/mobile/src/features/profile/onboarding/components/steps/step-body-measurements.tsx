import React from "react";
import { View } from "react-native";

import { useT } from "@/lib/i18n";
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
  const { t } = useT();

  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.bodyMeasurements.title")}>
      <VStack className="flex flex-1 justify-center gap-16">
        <View className="flex w-full flex-row justify-center gap-12">
          <FormWheelPicker name="weight" label={t("weight")} data={weights} unit={t("units.kg")} />
          <FormWheelPicker name="height" label={t("height")} data={heights} unit={t("units.cm")} />
        </View>
      </VStack>
    </StepWrapper>
  );
};
