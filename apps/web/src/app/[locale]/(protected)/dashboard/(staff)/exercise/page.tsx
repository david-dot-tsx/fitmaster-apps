import React from "react";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { ExerciseTable } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/_components/table/exercise-table";
import { CreateExerciseDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/_components/create-exercise-dialog";
import { getSessionUser } from "@/lib/session-user";

export default async function ExercisePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isStaff) {
    notFound();
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.exercise.list.queryOptions());

  return (
    <PageWrapper title="Exercise">
      <div className="flex w-full flex-col">
        <div className="flex flex-row justify-end">
          <CreateExerciseDialog />
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <ExerciseTable />
        </div>
      </div>
    </PageWrapper>
  );
}
