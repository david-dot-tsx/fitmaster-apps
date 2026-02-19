"use server";

import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session-user";
import { StaffDashboard } from "@/app/[locale]/(protected)/dashboard/_components/staff-dashboard";
import { CustomerDashboard } from "@/app/[locale]/(protected)/dashboard/_components/customer-dashboard";

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isAuthenticated) {
    redirect("/auth/login");
  }
  if (sessionUser.isStaff) {
    return <StaffDashboard />;
  }

  return <CustomerDashboard />;
}
