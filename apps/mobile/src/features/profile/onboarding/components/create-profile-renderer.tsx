import React from "react";

import {
  CUSTOMER_PROFILE_CREATE_STEPS,
  type CustomerProfileCreateStep,
} from "@/features/profile/onboarding/consts/steps";
import { StepIntroduction } from "@/features/profile/onboarding/components/steps/step-introduction";
import { StepBio } from "@/features/profile/onboarding/components/steps/step-bio";
import { StepBirthDate } from "@/features/profile/onboarding/components/steps/step-birth-date";
import { StepBodyMeasurements } from "@/features/profile/onboarding/components/steps/step-body-measurements";
import { StepWorkoutGoals } from "@/features/profile/onboarding/components/steps/step-workout-goals";
import { StepProfileImage } from "@/features/profile/onboarding/components/steps/step-profile-image";

const steps = {
  [CUSTOMER_PROFILE_CREATE_STEPS.INTRODUCTION]: <StepIntroduction />,
  [CUSTOMER_PROFILE_CREATE_STEPS.BIRTH_DATE]: <StepBirthDate />,
  [CUSTOMER_PROFILE_CREATE_STEPS.BODY_MEASUREMENTS]: <StepBodyMeasurements />,
  [CUSTOMER_PROFILE_CREATE_STEPS.PROFILE_IMAGE]: <StepProfileImage />,
  [CUSTOMER_PROFILE_CREATE_STEPS.BIO]: <StepBio />,
  [CUSTOMER_PROFILE_CREATE_STEPS.WORKOUT_GOALS]: <StepWorkoutGoals />,
};

export const CreateProfileRenderer = ({
  currentStep,
}: {
  currentStep: CustomerProfileCreateStep;
}) => {
  return steps[currentStep];
};
