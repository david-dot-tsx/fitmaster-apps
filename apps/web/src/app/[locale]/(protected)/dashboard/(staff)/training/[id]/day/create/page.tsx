import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { DayCreateContent } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/day-create-content";

export default async function DayCreatePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.training.getById.queryOptions({ id }));
  void queryClient.prefetchQuery(trpcServerOptionsProxy.exercise.list.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DayCreateContent trainingId={id} />
    </HydrationBoundary>
  );
}
