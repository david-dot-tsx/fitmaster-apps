import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react-native";

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
    <ScreenWrapper
      header={{
        title: "Profile setup",
        description: "Onboarding",
        subtitle: "Tell us about you so we can personalize your training.",
        icon: UserRound,
      }}
    >
      <FormProvider {...methods}>
        <StepStage />
      </FormProvider>
    </ScreenWrapper>
  );
};
