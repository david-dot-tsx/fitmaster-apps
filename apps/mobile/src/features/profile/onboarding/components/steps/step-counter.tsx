import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";

interface StepCounterProps {
  currentStep: number;
  maxSteps: number;
}
export const StepCounter = ({ currentStep, maxSteps }: StepCounterProps) => {
  return (
    <HStack>
      <Text
        className={cn("text-xl font-semibold text-typography-500", {
          "text-amber-400": currentStep === maxSteps,
        })}
      >
        {currentStep}
      </Text>
      <Text className="text-xl font-semibold text-typography-500">/</Text>
      <Text className="text-xl font-semibold text-amber-400">{maxSteps}</Text>
    </HStack>
  );
};
