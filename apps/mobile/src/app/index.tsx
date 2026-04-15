import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { Role } from "@repo/validators";

import { trpc } from "@/lib/trpc/client";
import { useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { AppBootstrapScreen } from "@/components/layout/app-bootstrap-screen";
import StaffScreen from "@/components/staff-screen";

const MIN_LOADING_MS = 1000;

export default function Index() {
  const { authStatus } = useAuthStoreState();
  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMinLoadingElapsed(true), MIN_LOADING_MS);

    return () => clearTimeout(id);
  }, []);

  const { data: me, isLoading: isMeLoading } = trpc.user.me.useQuery(undefined, {
    enabled: authStatus === AUTH_STATUS.AUTHENTICATED,
  });

  const isBootstrapping =
    authStatus === AUTH_STATUS.LOADING || (authStatus === AUTH_STATUS.AUTHENTICATED && isMeLoading);

  /** Keeps the loading UI visible for at least {@link MIN_LOADING_MS} after mount. */
  const showLoadingPhase = isBootstrapping || !minLoadingElapsed;

  if (!showLoadingPhase && me?.role !== Role.CUSTOMER) {
    return <StaffScreen />;
  }
  if (
    !showLoadingPhase &&
    authStatus === AUTH_STATUS.AUTHENTICATED &&
    me != null &&
    me.profile !== null
  ) {
    return <Redirect href="/main" />;
  }

  const phase = (() => {
    if (showLoadingPhase) {
      return "loading" as const;
    }
    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return "login" as const;
    }
    if (authStatus === AUTH_STATUS.AUTHENTICATED && me?.profile === null) {
      return "onboarding" as const;
    }

    return "loading" as const;
  })();

  return <AppBootstrapScreen phase={phase} />;
}
