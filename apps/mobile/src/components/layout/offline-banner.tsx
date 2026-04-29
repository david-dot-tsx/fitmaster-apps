import React from "react";
import { Text, View } from "react-native";

import { useT } from "@/lib/i18n";
import { useConnectivity } from "@/providers/connectivity-provider";

export const OfflineBanner = () => {
  const { isOnline } = useConnectivity();
  const { t } = useT();

  if (isOnline) {
    return null;
  }

  return (
    <View className="bg-red-500/90 px-4 py-2">
      <Text className="text-center text-xs font-bold uppercase tracking-wider text-white">
        {t("common:offline")}
      </Text>
    </View>
  );
};
