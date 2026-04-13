import React from "react";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { VStack } from "@/components/ui/vstack";
import { FormTextarea } from "@/components/form/form-textarea";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepWorkoutGoals = () => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.workoutGoals.title")}>
      <VStack className="flex flex-1">
        <FormTextarea
          name="goal"
          label={t("goal")}
          placeholder={t("mobile:screens.onboarding.steps.workoutGoals.placeholder")}
          maxLength={200}
        />
      </VStack>
    </StepWrapper>
  );
};
