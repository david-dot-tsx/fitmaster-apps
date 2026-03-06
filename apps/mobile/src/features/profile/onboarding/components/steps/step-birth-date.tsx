import React from "react";
import { View } from "react-native";

import { FormWheelPickerDate } from "@/components/form/form-wheel-picker-date";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepBirthDate = () => {
  return (
    <StepWrapper title="Birth Date">
      <View className="flex flex-1 items-center justify-center">
        <FormWheelPickerDate name="dateOfBirth" />
      </View>
    </StepWrapper>
  );
};
