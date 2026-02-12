"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  session: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: false,
});

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: boolean;
}) {
  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
};
