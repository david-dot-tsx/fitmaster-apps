import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session-user";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isAuthenticated) {
    return <>{children}</>;
  }

  redirect("/");
}
