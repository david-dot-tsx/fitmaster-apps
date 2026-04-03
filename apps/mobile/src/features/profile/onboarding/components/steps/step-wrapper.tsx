import React from "react";

import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

interface StepWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const StepWrapper = ({ title, children }: StepWrapperProps) => {
  return (
    <VStack className="flex-1 px-4">
      <Heading
        size="lg"
        className="mb-6 font-orbitron-semibold uppercase tracking-tight text-zinc-100"
      >
        {title}
      </Heading>
      {children}
    </VStack>
  );
};
