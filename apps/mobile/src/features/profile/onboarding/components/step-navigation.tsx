import React from "react";
import { View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

export const StepNavigation = ({
  next,
  previous,
  isLastStep,
  isFirstStep,
  handleSubmit,
}: {
  next: () => void;
  previous: () => void;
  isLastStep: () => boolean;
  isFirstStep: () => boolean;
  handleSubmit: () => void;
}) => {
  return (
    <HStack className="mb-10 w-full justify-between px-4">
      <View>
        {!isFirstStep() && (
          <Button onPress={() => previous()} variant="outline" className="border-transparent">
            <ButtonText>Previous</ButtonText>
          </Button>
        )}
      </View>
      <View>
        {isLastStep() ? (
          <Button onPress={handleSubmit} action="primary">
            <ButtonText className="text-zinc-950">Submit</ButtonText>
          </Button>
        ) : (
          <Button onPress={next} action="primary">
            <ButtonText className="text-zinc-950">Next</ButtonText>
          </Button>
        )}
      </View>
    </HStack>
  );
};
