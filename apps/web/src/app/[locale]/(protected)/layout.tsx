// app/(protected)/layout.tsx
import { redirect } from "next/navigation";

import { hasSessionTokensAction } from "@/actions/session.actions";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  if (!hasToken && !hasRefreshToken) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
