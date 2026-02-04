import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/auth/auth-context";
import { TRPCReactProvider } from "@/lib/trpc/client";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <TRPCReactProvider>
        <AuthProvider>{children}</AuthProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
