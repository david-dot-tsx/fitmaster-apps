import { createContext, useContext, useEffect } from "react";
import { router } from "expo-router";
import { type MutationStatus, useQueryClient } from "@tanstack/react-query";

import { useAuthStoreActions, useAuthStoreState } from "@/providers/auth/auth.store";
import { AUTH_STATUS } from "@/providers/auth/types";
import { trpc } from "@/lib/trpc/client";

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
  const queryClient = useQueryClient();
  const { setAuthenticated, setUnauthenticated, loadTokens } = useAuthStoreActions();
  const { authStatus, refreshToken } = useAuthStoreState();

  const {
    mutate: mutateLogin,
    status: loginStatus,
    error: loginError,
  } = trpc.auth.login.useMutation({
    onSuccess: async (result) => {
      await setAuthenticated(result.token, result.refreshToken);
      router.push("/");
    },
  });

  const { mutate: mutateLogout } = trpc.auth.logout.useMutation({
    onSettled: () => {
      setUnauthenticated();
      queryClient.clear();
      router.push("/auth/login");
    },
  });

  const { mutate: mutateRefreshToken } = trpc.auth.refreshToken.useMutation({
    onSuccess: (result) => {
      setAuthenticated(result.token, result.refreshToken);
    },
    onError: (_error) => {
      setUnauthenticated();
      router.push("/auth/login");
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
