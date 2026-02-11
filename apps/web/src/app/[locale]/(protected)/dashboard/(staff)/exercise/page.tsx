import React from "react";
import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { ExerciseTable } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/_components/table/exercise-table";

export default function ExercisePage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.exercise.list.queryOptions());

  return (
    <PageWrapper title="Exercise">
      <div className="flex w-full flex-col">
        <div className="flex flex-row justify-end">
          <Button asChild>
            <Link href="/dashboard/exercise/create">Add Exercise</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <ExerciseTable />
        </div>
      </div>
    </PageWrapper>
  );
}
