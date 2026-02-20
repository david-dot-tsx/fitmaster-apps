"use server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { type TrainingStatus } from "@repo/validators";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { TrainingTabContent } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-tab-content";

export const TrainingTab = async ({ statuses }: { statuses: TrainingStatus[] }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpcServerOptionsProxy.training.listStaff.queryOptions({
      status: statuses,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrainingTabContent statuses={statuses} />
    </HydrationBoundary>
  );
};
