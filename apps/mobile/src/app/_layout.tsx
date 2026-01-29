import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { RootProvider } from "@/providers/root-provider";
import { AUTH_STATUS } from "@/context/auth/types";
import { useAuthStoreState } from "@/context/auth/auth.store";

const CurrentScreen = {
  [AUTH_STATUS.AUTHENTICATED]: "(tabs)",
  [AUTH_STATUS.UNAUTHENTICATED]: "auth",
  [AUTH_STATUS.LOADING]: "boot-screen",
};
function RootNavigation() {
  const { authStatus } = useAuthStoreState();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={CurrentScreen[authStatus]} options={{ headerShown: false }} />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <RootProvider>
      <RootNavigation />
      <StatusBar style="auto" />
    </RootProvider>
  );
}
