import { Redirect } from "expo-router";

import { trpc } from "@/lib/trpc/client";
import { useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";

export default function Index() {
  const { authStatus } = useAuthStoreState();

  const { data: me, isLoading: isMeLoading } = trpc.user.me.useQuery(undefined, {
    enabled: authStatus === AUTH_STATUS.AUTHENTICATED,
  });

  if (
    authStatus === AUTH_STATUS.LOADING ||
    (authStatus === AUTH_STATUS.AUTHENTICATED && isMeLoading)
  ) {
    return (
      <ScreenWrapper className="flex flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-slate-500">Loading...</Text>
      </ScreenWrapper>
    );
  }

  if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
    return <Redirect href="/auth/login" />;
  }

  if (me?.profile === null) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
