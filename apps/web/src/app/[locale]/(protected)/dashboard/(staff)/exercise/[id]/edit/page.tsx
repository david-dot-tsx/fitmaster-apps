import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ExerciseEditForm } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/[id]/edit/_components/exercise-edit-form";
import { getQueryClient, trpcServerOptionsProxy } from "@/lib/trpc/client-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditExercisePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpcServerOptionsProxy.exercise.getById.queryOptions({ id }));

  return (
    <PageWrapper size="medium">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-amber-400">Edit Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseEditForm id={id} />
          </CardContent>
        </Card>
      </HydrationBoundary>
    </PageWrapper>
  );
}
