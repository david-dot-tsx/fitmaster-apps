import { Redirect } from "expo-router";

import { useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";

export default function Index() {
  const { authStatus } = useAuthStoreState();

  if (authStatus === AUTH_STATUS.LOADING) {
    return (
      <ScreenWrapper className="flex flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-slate-500">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (authStatus === AUTH_STATUS.AUTHENTICATED) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
