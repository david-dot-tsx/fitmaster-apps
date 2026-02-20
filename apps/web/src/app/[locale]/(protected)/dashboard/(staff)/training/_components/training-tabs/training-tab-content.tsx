"use client";

import { useQuery } from "@tanstack/react-query";

import { type Role, type TrainingStatus } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { TrainingTable } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-table";
import { LoadingState } from "@/components/query/loading-state";
import { ErrorState } from "@/components/query/error-state";

export const TrainingTabContent = ({
  statuses,
  userRole,
}: {
  statuses: TrainingStatus[];
  userRole: Role;
}) => {
  const trpc = useTRPC();
  const { data, status, refetch } = useQuery(
    trpc.training.listStaff.queryOptions({
      status: statuses,
    }),
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      {status === "pending" && <LoadingState message="Loading trainings…" />}
      {status === "error" && <ErrorState title="Failed to load trainings" onTryAgain={refetch} />}
      {status === "success" && data && <TrainingTable trainings={data} userRole={userRole} />}
    </div>
  );
};
