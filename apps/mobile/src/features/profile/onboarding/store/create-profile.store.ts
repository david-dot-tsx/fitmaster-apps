import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  CUSTOMER_PROFILE_CREATE_STEPS,
  type CustomerProfileCreateStep,
} from "@/features/profile/onboarding/consts/steps";

export const stepOrder: CustomerProfileCreateStep[] = [
  CUSTOMER_PROFILE_CREATE_STEPS.INTRODUCTION,
  CUSTOMER_PROFILE_CREATE_STEPS.PROFILE_IMAGE,
  CUSTOMER_PROFILE_CREATE_STEPS.BIO,
  CUSTOMER_PROFILE_CREATE_STEPS.WORKOUT_GOALS,
  CUSTOMER_PROFILE_CREATE_STEPS.BIRTH_DATE,
  CUSTOMER_PROFILE_CREATE_STEPS.BODY_MEASUREMENTS,
] as const;

interface CreateProfileStoreState {
  currentStep: CustomerProfileCreateStep;
}

interface CreateProfileStoreActions {
  getStepIndex: (step: CustomerProfileCreateStep) => number;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  isSubmitStep: (step: CustomerProfileCreateStep) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const getInitialStep = () => {
  const step = stepOrder[0];
  if (!step) {
    throw new Error("step order is not defined");
  }

  return step;
};

const initialStoreState = {
  currentStep: getInitialStep(),
};

export const useCreateProfileStore = create<CreateProfileStoreState & CreateProfileStoreActions>()(
  immer((set, get) => ({
    ...initialStoreState,
    getStepIndex: (step: CustomerProfileCreateStep) => stepOrder.indexOf(step),
    isFirstStep: () => {
      const currentStepIndex = get().getStepIndex(get().currentStep);

      return currentStepIndex === 0;
    },
    isLastStep: () => {
      const currentStepIndex = get().getStepIndex(get().currentStep);

      return currentStepIndex === stepOrder.length - 1;
    },
    isSubmitStep: (step: CustomerProfileCreateStep) => {
      return step === CUSTOMER_PROFILE_CREATE_STEPS.PROFILE_IMAGE;
    },
    nextStep: () => {
      const currentStep = get().currentStep;
      const currentStepIndex = get().getStepIndex(currentStep);
      const nextStep = stepOrder[currentStepIndex + 1];

      set({ currentStep: nextStep });
    },
    previousStep: () => {
      const currentStep = get().currentStep;
      const currentStepIndex = get().getStepIndex(currentStep);
      const previousStep = stepOrder[currentStepIndex - 1];

      set({ currentStep: previousStep });
    },
    reset: () => {
      set(initialStoreState);
    },
  })),
);
