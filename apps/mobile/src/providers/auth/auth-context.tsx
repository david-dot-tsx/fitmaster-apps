import React, { createContext, useContext, useEffect } from "react";
import { router } from "expo-router";
import { type MutationStatus, useQueryClient } from "@tanstack/react-query";

import { API_PROCEDURE_ERRORS } from "@repo/api/client";

import { useAuthStoreActions, useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { trpc } from "@/lib/trpc/client";
import { useToastNotification } from "@/components/modules/toast-notifcation/toast-notification";
import { useT } from "@/lib/i18n";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

interface AuthContextType {
  login: ({ email, password }: { email: string; password: string }) => void;
  loginStatus: MutationStatus;
  loginError: ReturnType<typeof trpc.auth.login.useMutation>["error"];
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  login: async (_props: { email: string; password: string }) => {},
  loginStatus: "idle",
  loginError: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useT();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const queryClient = useQueryClient();
  const { setAuthenticated, setUnauthenticated, loadTokens } = useAuthStoreActions();
  const { authStatus, refreshToken } = useAuthStoreState();
  const { openToast } = useToastNotification();
  const {
    mutate: mutateLogin,
    status: loginStatus,
    error: loginError,
  } = trpc.auth.login.useMutation({
    onSuccess: async (result) => {
      await setAuthenticated(result.token, result.refreshToken);
      router.push("/");
    },
    onError: (error) => {
      handleApiErrorMessage(error.message, {
        onMatch: {
          [API_PROCEDURE_ERRORS.INVALID_CREDENTIALS]: (translatedMessage: string) => {
            openToast({
              title: t("mobile:screens.login.failed.title"),
              description: translatedMessage,
              action: "error",
            });
          },
        },
        default: (translatedMessage: string) => {
          openToast({
            title: t("mobile:screens.login.failed.title"),
            description: translatedMessage,
            action: "error",
          });
        },
      });
    },
  });

  const { mutate: mutateLogout } = trpc.auth.logout.useMutation({
    onSettled: async () => {
      router.replace("/auth/login");
      setUnauthenticated();
      await queryClient.cancelQueries();
      queryClient.removeQueries();
      queryClient.clear();
    },
  });

  const { mutate: mutateRefreshToken } = trpc.auth.refreshToken.useMutation({
    onSuccess: (result) => {
      setAuthenticated(result.token, result.refreshToken);
    },
    onError: (_error) => {
      setUnauthenticated();
      router.replace("/auth/login");
    },
  });

  const login = ({ email, password }: { email: string; password: string }) => {
    mutateLogin({ email, password });
  };

  const logout = async () => {
    mutateLogout({ refreshToken: refreshToken as string });
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const { token, refreshToken } = await loadTokens();
      if (token && refreshToken) {
        mutateRefreshToken({ refreshToken });
      } else {
        setUnauthenticated();
      }
    };

    if (authStatus === AUTH_STATUS.LOADING) {
      bootstrapAuth();
    }
    // It has only run once on mount, so we don't need to add the authStatus to the dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ login, loginStatus, loginError, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
