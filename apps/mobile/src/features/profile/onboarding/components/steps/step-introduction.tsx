import React from "react";
import { type ResourceKey } from "i18next";

import { Gender, type GenderType } from "@repo/validators";
import { getTKey } from "@repo/i18n/mobile";

import { useT } from "@/lib/i18n";
import { VStack } from "@/components/ui/vstack";
import { FormInput } from "@/components/form/form-input";
import { FormRadio } from "@/components/form/form-radio";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

const genderOptions: { label: ResourceKey; value: GenderType }[] = [
  { label: getTKey("common:enums.gender.male"), value: Gender.MALE },
  { label: getTKey("common:enums.gender.female"), value: Gender.FEMALE },
  { label: getTKey("common:enums.gender.other"), value: Gender.OTHER },
];

export const StepIntroduction = () => {
  const { t } = useT();

  return (
    <StepWrapper title={t("mobile:screens.onboarding.steps.introduction.title")}>
      <VStack className="gap-6">
        <FormInput name="firstName" label={t("firstName")} placeholder={t("firstName")} />
        <FormInput name="lastName" label={t("lastName")} placeholder={t("lastName")} />
        <FormInput name="nickname" label={t("nickname")} placeholder={t("nickname")} />
        <FormRadio name="gender" label={t("gender")} options={genderOptions} />
      </VStack>
    </StepWrapper>
  );
};
