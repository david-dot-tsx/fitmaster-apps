import { View, Text } from "react-native";
import React from "react";
import { LogOutIcon, TriangleAlertIcon } from "lucide-react-native";

import { useT } from "@/lib/i18n";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { useAuthContext } from "@/providers/auth/auth-context";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

const StaffScreen = () => {
  const { logout } = useAuthContext();
  const { t } = useT();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenWrapper className="justify-center gap-4 px-4">
      <View className="rounded-2xl border border-amber-400/70 bg-zinc-900/50 px-4 py-8">
        <HStack className="items-center gap-4">
          <Icon as={TriangleAlertIcon} size={"3xl"} color={"#fbbf24"} />
          <VStack className="flex-1">
            <Heading size="sm">{t("screens.staff.title")}</Heading>
            <Text className="mt-2 text-wrap text-zinc-400">{t("screens.staff.description")}</Text>
          </VStack>
        </HStack>
      </View>
      <Button
        onPress={handleLogout}
        action="primary"
        variant="outline"
        className="group mt-4 border border-amber-400/70 bg-amber-400/20 data-[active=true]:border-amber-400 data-[active=true]:bg-amber-400/40"
        size="lg"
      >
        <ButtonText className="uppercase tracking-tight text-amber-400 data-[active=true]:text-amber-500">
          {t("logout")}
        </ButtonText>
        <ButtonIcon as={LogOutIcon} className=" mr-2.5 text-amber-400" />
      </Button>
    </ScreenWrapper>
  );
};

export default StaffScreen;
