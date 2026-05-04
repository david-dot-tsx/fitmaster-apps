import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { DayCreateContent } from "@/features/staff-training/training-day-creator/day-create-content";
import { getSessionUser } from "@/lib/session-user";

export default async function DayCreatePage({ params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isStaff) {
    notFound();
  }
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
