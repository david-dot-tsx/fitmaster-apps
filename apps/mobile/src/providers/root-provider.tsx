import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Device from "expo-device";

import { ApiQueryProvider } from "@repo/api/client";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { env } from "@/env";
import { AuthProvider } from "@/context/auth/auth-context";
import { useAuthStoreState } from "@/context/auth/auth.store";

const deviceInfo = {
  name: `${Device.deviceName} ${Device.osName}`,
  os: Device.osName ?? "",
};

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const { token } = useAuthStoreState();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApiQueryProvider url={env.EXPO_PUBLIC_API_URL} token={token} deviceInfo={deviceInfo}>
        <AuthProvider>{children}</AuthProvider>
      </ApiQueryProvider>
    </ThemeProvider>
  );
};
