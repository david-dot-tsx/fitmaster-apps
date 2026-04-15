import React from "react";
import { t } from "i18next";

import { VStack } from "@/components/ui/vstack";
import { FormProfilePicture } from "@/components/form/form-profile-picture";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";
import { cropProfileImage } from "@/features/profile/onboarding/utils/crop-profile-image";

export const StepProfileImage = () => {
  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.profileImage.title")}>
      <VStack className="flex flex-1 items-center justify-center">
        <FormProfilePicture name="image" transform={cropProfileImage} />
      </VStack>
    </StepWrapper>
  );
};
