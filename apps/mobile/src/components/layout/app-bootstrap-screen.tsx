import React from "react";
import { ActivityIndicator, Image, ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NAMESPACES } from "@repo/i18n/mobile";

import { useT } from "@/lib/i18n";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import bgLandingImage from "@/assets/images/bg-landing.jpg";
import appLogoImage from "@/assets/images/app-logo.png";
import appHeroImage from "@/assets/images/app-hero.png";

const LOGO_HEIGHT_PX = 24;
const logoAsset = Image.resolveAssetSource(appLogoImage);
const LOGO_WIDTH_PX =
  logoAsset.width > 0 && logoAsset.height > 0
    ? (LOGO_HEIGHT_PX / logoAsset.height) * logoAsset.width
    : LOGO_HEIGHT_PX * 2;

export type AppBootstrapPhase = "loading" | "login" | "onboarding";

type AppBootstrapScreenProps = {
  phase: AppBootstrapPhase;
};

/**
 * Full-screen entry while auth and user profile are resolved, or when the user must choose login vs onboarding.
 */
export const AppBootstrapScreen = ({ phase }: AppBootstrapScreenProps) => {
  const isLoading = phase === "loading";
  const { t } = useT([NAMESPACES.API_ERRORS]);

  return (
    <View className="flex-1 bg-zinc-950">
      <ImageBackground
        source={bgLandingImage}
        className="flex-1"
        resizeMode="cover"
        imageStyle={{
          bottom: 0,
          left: -300,
        }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.92)"]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="flex-1"
        >
          <SafeAreaView className="flex-1" edges={["top", "bottom", "left", "right"]}>
            <VStack className="flex-1 px-6 pb-8 pt-3">
              <Image
                source={appLogoImage}
                style={{
                  height: LOGO_HEIGHT_PX,
                  width: LOGO_WIDTH_PX,
                  alignSelf: "flex-start",
                }}
                resizeMode="contain"
                accessibilityLabel="FitMaster"
              />
              <View className="flex-1 justify-center pt-14">
                <VStack className="w-full items-center gap-5">
                  <View className="aspect-[4/3] w-full max-w-sm">
                    <Image source={appHeroImage} resizeMode="contain" className="size-full" />
                  </View>
                  <Text className="text-center font-orbitron-semibold text-xs uppercase tracking-[0.28em] text-zinc-400">
                    {t("slogan.keywords.strength")} · {t("slogan.keywords.focus")} ·{" "}
                    {t("slogan.keywords.progress")}
                  </Text>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fbbf24" />
                  ) : (
                    <Text className="max-w-sm text-center text-sm leading-relaxed text-zinc-300">
                      {phase === "login"
                        ? t("mobile:screens.bootstrap.phaseCta.login")
                        : t("mobile:screens.bootstrap.phaseCta.onboarding")}
                    </Text>
                  )}
                </VStack>
              </View>

              {(phase === "login" || phase === "onboarding") && (
                <HStack className="w-full justify-end pb-2 pt-6">
                  {phase === "login" && (
                    <Button
                      size="lg"
                      action="primary"
                      className="bg-amber-400"
                      onPress={() => {
                        router.push("/auth/login");
                      }}
                    >
                      <ButtonText className="uppercase">{t("launch")}</ButtonText>
                      <ButtonIcon as={ChevronRight} size="xl" />
                    </Button>
                  )}
                  {phase === "onboarding" && (
                    <Button
                      size="lg"
                      action="primary"
                      className="bg-amber-400"
                      onPress={() => router.push("/onboarding")}
                    >
                      <ButtonText className="uppercase">{t("continue")}</ButtonText>
                      <ButtonIcon as={ChevronRight} size="xl" />
                    </Button>
                  )}
                </HStack>
              )}
            </VStack>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
