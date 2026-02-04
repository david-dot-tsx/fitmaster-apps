"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { type UserMeOutput } from "@repo/api/schemas";

import { useTRPC } from "@/lib/trpc/client";

interface AuthContextType {
  session: boolean;
  me?: UserMeOutput;
}

const AuthContext = createContext<AuthContextType>({
  session: false,
  me: undefined,
});

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: boolean;
}) {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false }));

  return <AuthContext.Provider value={{ session, me: data }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
};
