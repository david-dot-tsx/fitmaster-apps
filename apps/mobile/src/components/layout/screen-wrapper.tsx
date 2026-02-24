import React from "react";

import { VStack } from "@/components/ui/vstack";

export const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return <VStack className="size-full flex-1 bg-zinc-950">{children}</VStack>;
};
