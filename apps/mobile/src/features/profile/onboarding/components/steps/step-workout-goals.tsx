import React from "react";

import { VStack } from "@/components/ui/vstack";
import { FormTextarea } from "@/components/form/form-textarea";
import { StepWrapper } from "@/features/profile/onboarding/components/steps/step-wrapper";

export const StepWorkoutGoals = () => {
  return (
    <StepWrapper title="Workout Goals">
      <VStack className="flex flex-1">
        <FormTextarea
          name="goal"
          label="Goal"
          placeholder="What is your fitness goal? (e.g. lose weight, gain muscle, etc.)"
          maxLength={200}
        />
      </VStack>
    </StepWrapper>
  );
};
