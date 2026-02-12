"use server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { UserDetails } from "@/app/[locale]/(protected)/dashboard/_components/user-details";
import { hasSessionTokensAction } from "@/actions/session.actions";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const { hasToken } = await hasSessionTokensAction();
  if (hasToken) {
    await queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());
  }

  return (
    <PageWrapper title="Dashboard">
      <Link href="/dashboard/exercise">Exercises</Link>
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
