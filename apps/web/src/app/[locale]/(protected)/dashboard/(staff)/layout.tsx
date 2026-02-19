import { notFound } from "next/navigation";

import { getSessionUser } from "@/lib/session-user";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (sessionUser.isStaff) {
    return <>{children}</>;
  }

  notFound();
}
