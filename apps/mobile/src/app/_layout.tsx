import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import "react-native-reanimated";
import "@/global.css";

import { ApiQueryProvider } from "@repo/api/client";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { env } from "@/env";
import { AuthProvider } from "@/context/auth-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

const deviceInfo = {
  name: `${Device.deviceName} ${Device.osName}`,
  os: Device.osName ?? "",
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApiQueryProvider
        url={env.EXPO_PUBLIC_API_URL}
        getToken={() => SecureStore.getItemAsync("token")}
        deviceInfo={deviceInfo}
      >
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ApiQueryProvider>
    </ThemeProvider>
  );
}
