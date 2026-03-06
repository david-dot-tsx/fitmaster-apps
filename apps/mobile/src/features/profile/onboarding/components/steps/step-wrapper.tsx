import React from "react";

import { Heading } from "@/components/ui/heading";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { VStack } from "@/components/ui/vstack";

interface StepWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const StepWrapper = ({ title, children }: StepWrapperProps) => {
  return (
    <ScreenWrapper>
      <VStack className="flex flex-1">
        <Heading className="mb-8 text-center text-2xl font-bold text-amber-400"> {title}</Heading>
        {children}
      </VStack>
    </ScreenWrapper>
  );
};
