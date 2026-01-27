import { createContext, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { trpc, useQueryClient } from "@repo/api/client";

const AUTH_STATES = {
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
};
type AuthState = (typeof AUTH_STATES)[keyof typeof AUTH_STATES];

interface AuthContextType {
  authState?: AuthState;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  authState: AUTH_STATES.UNAUTHENTICATED,
  login: async (_email: string, _password: string) => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>(AUTH_STATES.UNAUTHENTICATED);

  const mutateLogin = trpc.user.login.useMutation({
    onSuccess: (result) => {
      setAuthState(AUTH_STATES.AUTHENTICATED);
      SecureStore.setItem("token", result.token);
    },
  });

  const login = (email: string, password: string) => {
    mutateLogin.mutate({ email, password });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setAuthState(AUTH_STATES.UNAUTHENTICATED);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
