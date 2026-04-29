import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { AuthProvider } from "@/providers/auth/auth-context";
import { ConnectivityProvider } from "@/providers/connectivity-provider";
import { FontProvider } from "@/providers/font-provider";

import "@/lib/i18n";
import "@/global.css";

if (__DEV__) {
  import("@/../reactotron.config");
}

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const nativewindColorScheme = useNativewindColorScheme();

  useEffect(() => {
    nativewindColorScheme.setColorScheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <TRPCReactProvider>
          <AuthProvider>
            <ConnectivityProvider>
              <FontProvider>
                <OfflineBanner />
                {children}
              </FontProvider>
            </ConnectivityProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
};
