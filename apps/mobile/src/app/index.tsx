import { Redirect } from "expo-router";
import { View, Text } from "react-native";

import { useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";

export default function Index() {
  const { authStatus } = useAuthStoreState();

  if (authStatus === AUTH_STATUS.LOADING) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-500">
        <Text className="text-2xl font-bold text-slate-700">Loading...</Text>
      </View>
    );
  }

  if (authStatus === AUTH_STATUS.AUTHENTICATED) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
