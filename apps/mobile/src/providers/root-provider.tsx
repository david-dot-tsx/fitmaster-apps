import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/auth/auth-context";
import { TRPCReactProvider } from "@/lib/trpc/client";

import "@/lib/i18n";
import "@/global.css";

if (__DEV__) {
  import("@/../reactotron.config");
}

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const nativewindColorScheme = useNativewindColorScheme();

  useEffect(() => {
    nativewindColorScheme.setColorScheme("dark");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DarkTheme}>
          <TRPCReactProvider>
            <AuthProvider>{children}</AuthProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};
