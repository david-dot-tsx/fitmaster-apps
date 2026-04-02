import { useEffect } from "react";
import "react-native-reanimated";
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
  Orbitron_900Black,
} from "@expo-google-fonts/orbitron";
import { Quantico_400Regular, Quantico_700Bold } from "@expo-google-fonts/quantico";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

const orbitronFonts = {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
  Orbitron_900Black,
};
const interFonts = {
  Inter_400Regular,
};

const quanticoFonts = {
  Quantico_400Regular,
  Quantico_700Bold,
};

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded, error] = useFonts({
    ...orbitronFonts,
    ...interFonts,
    ...quanticoFonts,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return <>{children}</>;
};
