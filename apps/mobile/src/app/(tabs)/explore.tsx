import { StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LanguagePicker } from "@/components/ui/language-picker";

export default function TabTwoScreen() {
  const { t } = useTranslation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <Text>Test</Text>
      <Text>{t("interpolation", { name: "John" })}</Text>
      <LanguagePicker />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
