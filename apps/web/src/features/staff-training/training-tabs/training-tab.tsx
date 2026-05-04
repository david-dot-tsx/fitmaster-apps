"use server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { type TrainingStatus } from "@repo/validators";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { TrainingTabContent } from "@/features/staff-training/training-tabs/training-tab-content";
import { getSessionUser } from "@/lib/session-user";

export const TrainingTab = async ({ statuses }: { statuses: TrainingStatus[] }) => {
  const sessionUser = await getSessionUser();
  const userRole = sessionUser.user?.role;
  if (!userRole) {
    throw new Error("User role not found");
  }
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpcServerOptionsProxy.training.listStaff.queryOptions({
      status: statuses,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrainingTabContent statuses={statuses} userRole={userRole} />
    </HydrationBoundary>
  );
};
