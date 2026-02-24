import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/auth/auth-context";
import { TRPCReactProvider } from "@/lib/trpc/client";
import "@/lib/i18n";
import "@/global.css"; // Make sure this path is correct

export default function App() {
  return <GluestackUIProvider>{/* Add your app code here */}</GluestackUIProvider>;
}

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <TRPCReactProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};
