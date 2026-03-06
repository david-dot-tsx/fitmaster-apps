import React from "react";
import { Stack } from "expo-router";

const OnboardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right",
        animationTypeForReplace: "push",
        gestureEnabled: true,
        freezeOnBlur: false,
      }}
    >
      <Stack.Screen name="(index)" options={{ headerShown: false }} />
      <Stack.Screen name="completed" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OnboardingLayout;
