import React from "react";

import { VStack } from "@/components/ui/vstack";
import { FormTextarea } from "@/components/form/form-textarea";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepBio = () => {
  return (
    <StepWrapper title="Bio">
      <VStack className="flex flex-1 justify-center">
        <FormTextarea
          name="bio"
          label="Bio"
          placeholder="Tell others a little about yourself… 😊"
          maxLength={200}
        />
      </VStack>
    </StepWrapper>
  );
};
