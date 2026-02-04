"use server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { UserDetails } from "@/app/dashboard/~components/user-details";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <div>
          <h1>Dashboard (Server Component)</h1>
          <UserDetails />
        </div>
        <Link
          href="/auth/login"
          className="mt-4 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Login (Link) Server Component
        </Link>
      </div>
    </HydrationBoundary>
  );
}
