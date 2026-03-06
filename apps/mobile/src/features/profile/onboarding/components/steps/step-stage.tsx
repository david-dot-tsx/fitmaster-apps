import React, { useState } from "react";
import { AnimatePresence, MotiView } from "moti";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import { router } from "expo-router";

import { type CustomerProfileCreateInput } from "@repo/validators";

import { StepNavigation } from "@/features/profile/onboarding/components/step-navigation";
import { SubmitErrorModal } from "@/features/profile/onboarding/components/submit-error-modal";
import { stepFields } from "@/features/profile/onboarding/consts/steps";
import {
  stepOrder,
  useCreateProfileStore,
} from "@/features/profile/onboarding/store/create-profile.store";
import { CreateProfileRenderer } from "@/features/profile/onboarding/components/create-profile-renderer";
import { ProgressBar } from "@/components/progress-bar";
import { trpc } from "@/lib/trpc/client";
import { getRandomImageUrl } from "@/utils/get-random-image-url";
import { StepCounter } from "@/features/profile/onboarding/components/steps/step-counter";
import { HStack } from "@/components/ui/hstack";

const translateXfactor = 300;

export const StepStage = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    getStepIndex,
    isLastStep,
    isFirstStep,
    reset: resetStore,
  } = useCreateProfileStore();
  const [direction, setDirection] = useState(1);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { trigger, handleSubmit, reset: resetForm } = useFormContext<CustomerProfileCreateInput>();

  const createCustomerProfileMutation = trpc.profile.createCustomerProfile.useMutation();

  const submitData = (data: CustomerProfileCreateInput) => {
    createCustomerProfileMutation.mutate(
      {
        ...data,
        imageUrl: getRandomImageUrl(), //TODO: remove this when api is ready
      },
      {
        onSuccess: () => {
          router.replace("/onboarding/completed");
        },
        onError: () => {
          setShowErrorModal(true);
        },
      },
    );
  };

  const onSubmit = handleSubmit(submitData);

  const handleTryAgain = () => {
    setShowErrorModal(false);
    onSubmit();
  };

  const handleRestartForm = () => {
    setShowErrorModal(false);
    resetForm();
    resetStore();
  };

  const handleNext = async () => {
    const result = await trigger(stepFields[currentStep]);
    if (result) {
      setDirection(1);
      requestAnimationFrame(() => {
        nextStep();
      });
    }
  };
  const handlePrevious = () => {
    setDirection(-1);
    requestAnimationFrame(() => {
      previousStep();
    });
  };

  return (
    <View className="mb-12 flex-1 bg-zinc-950">
      <SubmitErrorModal
        isOpen={showErrorModal}
        onTryAgain={handleTryAgain}
        onRestartForm={handleRestartForm}
      />
      <HStack className="w-full gap-4 px-4">
        <ProgressBar
          className="mb-8 mt-2"
          currentValue={getStepIndex(currentStep)}
          maxValue={stepOrder.length - 1}
        />
        <StepCounter currentStep={getStepIndex(currentStep) + 1} maxSteps={stepOrder.length} />
      </HStack>
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentStep}
          from={{ opacity: 0.2, translateX: translateXfactor * direction }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0.2, translateX: -translateXfactor * direction }}
          transition={{ type: "timing", duration: 200 }}
          className="flex-1"
        >
          <CreateProfileRenderer currentStep={currentStep} />
        </MotiView>
      </AnimatePresence>
      <StepNavigation
        key={currentStep}
        next={handleNext}
        previous={handlePrevious}
        handleSubmit={onSubmit}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </View>
  );
};
