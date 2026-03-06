import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { customerProfileCreateFormSchema } from "@repo/validators";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { StepStage } from "@/features/profile/onboarding/components/steps/step-stage";

export const OnboardingScreen = () => {
  const methods = useForm({
    resolver: zodResolver(customerProfileCreateFormSchema),
    defaultValues: {
      nickname: "",
      firstName: null,
      lastName: null,
      birthDate: new Date(),
      gender: null,
      bio: null,
      height: 180,
      weight: 70,
      goal: null,
      imageUrl: null,
    },
  });

  return (
    <ScreenWrapper className="pt-12">
      <FormProvider {...methods}>
        <StepStage />
      </FormProvider>
    </ScreenWrapper>
  );
};
