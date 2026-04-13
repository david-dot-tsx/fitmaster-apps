import React from "react";
import { LinearGradient } from "expo-linear-gradient";

import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section = ({ title, children }: SectionProps) => {
  return (
    <VStack>
      <Heading size="sm" className="uppercase tracking-widest text-zinc-400">
        {title}
      </Heading>
      <LinearGradient
        colors={["#3f3f46", "#3f3f46", "transparent"]}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mb-2.5 mt-0.5 h-px w-full rounded-lg"
      />
      {children}
    </VStack>
  );
};
