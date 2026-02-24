import React from "react";
import { View } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

export const ScreenWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <View className={cn("size-full flex-1 bg-zinc-950", className)}>{children}</View>;
};
