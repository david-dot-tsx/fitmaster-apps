"use server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { UserDetails } from "@/app/[locale]/(protected)/dashboard/_components/user-details";
import { hasSessionTokensAction } from "@/actions/session.actions";

const links = [
  {
    label: "Exercises",
    href: "/dashboard/exercise",
  },
  {
    label: "Create Exercise",
    href: "/dashboard/exercise/create",
  },
  {
    label: "Trainings",
    href: "/dashboard/training",
  },
];

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const { hasToken } = await hasSessionTokensAction();
  if (hasToken) {
    await queryClient.prefetchQuery(trpcServerOptionsProxy.user.me.queryOptions());
  }

  return (
    <PageWrapper title="Dashboard">
      <ul className="list-disc">
        {links.map((link) => (
          <li key={link.href} className="text-blue-400">
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-8 flex w-full flex-col">
          <div>
            <UserDetails />
          </div>
        </div>
      </HydrationBoundary>
    </PageWrapper>
  );
}
