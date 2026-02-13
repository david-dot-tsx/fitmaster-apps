import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { TrainingContent } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_component/content";

export default async function TrainingDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpcServerOptionsProxy.training.getById.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrainingContent id={id} />
    </HydrationBoundary>
  );
}
