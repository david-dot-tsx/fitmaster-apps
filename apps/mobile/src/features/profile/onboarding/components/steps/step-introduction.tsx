import React from "react";

import { Gender } from "@repo/validators";

import { VStack } from "@/components/ui/vstack";
import { FormInput } from "@/components/form/form-input";
import { FormRadio } from "@/components/form/form-radio";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

const genderOptions = [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: "Other", value: Gender.OTHER },
];

export const StepIntroduction = () => {
  return (
    <StepWrapper title="Introduce yourself">
      <VStack className="gap-6">
        <FormInput name="firstName" label="First Name" placeholder="First Name" />
        <FormInput name="lastName" label="Last Name" placeholder="Last Name" />
        <FormInput name="nickname" label="Nickname" placeholder="Nickname" />
        <FormRadio name="gender" label="Gender" options={genderOptions} />
      </VStack>
    </StepWrapper>
  );
};
