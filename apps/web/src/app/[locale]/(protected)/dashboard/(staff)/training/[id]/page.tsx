import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { TrainingContent } from "@/features/staff-training/training-detail/content";
import { getSessionUser } from "@/lib/session-user";

export default async function TrainingDetailPage({ params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isStaff) {
    notFound();
  }
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpcServerOptionsProxy.training.getById.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrainingContent id={id} />
    </HydrationBoundary>
  );
}
