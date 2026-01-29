import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

import { AUTH_STATUS, type AuthStatus } from "@/context/auth/types";

const AUTH_TOKENS = {
  authToken: "token",
  refreshToken: "refreshToken",
};

interface AuthState {
  authStatus: AuthStatus;
  token: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setAuthenticated: (token: string, refreshToken: string) => Promise<void>;
  setUnauthenticated: () => Promise<void>;
  loadTokens: () => Promise<{ token: string | null; refreshToken: string | null }>;
}

type AuthStore = { state: AuthState; actions: AuthActions };

const loadTokensFromSecureStorage = async () => {
  const token = await SecureStore.getItemAsync(AUTH_TOKENS.authToken);
  const refreshToken = await SecureStore.getItemAsync(AUTH_TOKENS.refreshToken);

  return { token, refreshToken };
};

export const useAuthStore = create<AuthStore>((set) => ({
  state: {
    authStatus: AUTH_STATUS.LOADING,
    token: null,
    refreshToken: null,
  },
  actions: {
    setAuthenticated: async (token, refreshToken) => {
      await Promise.all([
        SecureStore.setItemAsync(AUTH_TOKENS.authToken, token),
        SecureStore.setItemAsync(AUTH_TOKENS.refreshToken, refreshToken),
      ]);
      set({
        state: {
          authStatus: AUTH_STATUS.AUTHENTICATED,
          token,
          refreshToken,
        },
      });
    },
    setUnauthenticated: async () => {
      await Promise.all([
        SecureStore.deleteItemAsync(AUTH_TOKENS.authToken),
        SecureStore.deleteItemAsync(AUTH_TOKENS.refreshToken),
      ]);
      set({
        state: {
          authStatus: AUTH_STATUS.UNAUTHENTICATED,
          token: null,
          refreshToken: null,
        },
      });
    },
    loadTokens: async () => loadTokensFromSecureStorage(),
  },
}));

export const useAuthStoreState = () => useAuthStore((state) => state.state);
export const useAuthStoreActions = () => useAuthStore((state) => state.actions);
