import React from "react";
import { useTranslation } from "react-i18next";

import { NAMESPACES } from "@repo/i18n/mobile";

import { VStack } from "@/components/ui/vstack";
import { FormTextarea } from "@/components/form/form-textarea";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepBio = () => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);

  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.bio.title")}>
      <VStack className="flex flex-1">
        <FormTextarea
          name="bio"
          label={t("bio")}
          placeholder={t("mobile:screens.onboarding.steps.bio.placeholder")}
          maxLength={200}
        />
      </VStack>
    </StepWrapper>
  );
};
