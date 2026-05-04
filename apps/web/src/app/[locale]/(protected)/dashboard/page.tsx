"use server";

import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session-user";
import { StaffDashboard } from "@/features/dashboard/staff-dashboard";
import { CustomerDashboard } from "@/features/dashboard/customer-dashboard";

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
