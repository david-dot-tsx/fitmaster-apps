"use client";

import { useQuery } from "@tanstack/react-query";

import { type TrainingStatus } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { TrainingTable } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-table";

export const TrainingTabContent = ({ statuses }: { statuses: TrainingStatus[] }) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.training.listStaff.queryOptions({
      status: statuses,
    }),
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* TODO: Add a title for the tab REMOVE DIRCET STATUS TITLE use i18n for the title*/}
      <h2 className="text-2xl font-bold">STATUS: {statuses.join(", ")}</h2>
      <TrainingTable trainings={data ?? []} />
    </div>
  );
};
