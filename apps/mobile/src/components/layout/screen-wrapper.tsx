import React from "react";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader, type ScreenHeaderProps } from "@/components/layout/screen-header";

export const ScreenWrapper = ({
  children,
  className,
  header,
  testID,
}: {
  children: React.ReactNode;
  className?: string;
  header?: ScreenHeaderProps;
  testID?: string;
}) => {
  return (
    <SafeAreaView testID={testID} className={cn("size-full flex-1 bg-zinc-950", className)}>
      {header && <ScreenHeader {...header} />}
      {children}
    </SafeAreaView>
  );
};
