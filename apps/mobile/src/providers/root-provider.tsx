import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { AuthProvider } from "@/providers/auth/auth-context";
import { FontProvider } from "@/providers/font-provider";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DarkTheme}>
          <TRPCReactProvider>
            <AuthProvider>
              <FontProvider>{children}</FontProvider>
            </AuthProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};
