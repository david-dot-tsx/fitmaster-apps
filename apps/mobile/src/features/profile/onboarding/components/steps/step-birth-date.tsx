import React from "react";
import { View } from "react-native";

import { useT } from "@/lib/i18n";
import { FormWheelPickerDate } from "@/components/form/form-wheel-picker-date";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepBirthDate = () => {
  const { t } = useT();

  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.birthDate.title")}>
      <View className="flex flex-1 items-center justify-center">
        <FormWheelPickerDate name="dateOfBirth" />
      </View>
    </StepWrapper>
  );
};
