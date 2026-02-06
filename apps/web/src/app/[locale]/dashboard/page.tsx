"use server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { UserDetails } from "@/app/[locale]/dashboard/_components/user-details";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());

  return (
    <PageWrapper title="Dashboard">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex w-full flex-col">
          <div>
            <h1>Dashboard (Server Component)</h1>
            <UserDetails />
          </div>
        </div>
      </HydrationBoundary>
    </PageWrapper>
  );
}
