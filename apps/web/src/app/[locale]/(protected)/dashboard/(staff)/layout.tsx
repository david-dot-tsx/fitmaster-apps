import { redirect } from "next/navigation";

import { hasSessionTokensAction } from "@/actions/session.actions";

// TODO: Check if user is staff
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  if (!hasToken && !hasRefreshToken) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
