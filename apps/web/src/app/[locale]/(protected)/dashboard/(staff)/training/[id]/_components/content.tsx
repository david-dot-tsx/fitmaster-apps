"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { notFound } from "next/navigation";

import { useTRPC } from "@/lib/trpc/client";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { EditTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/edit-training-dialog";
import { TrainingHero } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_components/hero";
import { TrainingDayItem } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_components/training-day-item";

export const TrainingContent = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const { data: trainingData, status: trainingStatus } = useQuery(
    trpc.training.getById.queryOptions({ id }),
  );
  const { data: trainingDaysData, status: trainingDaysStatus } = useQuery(
    trpc.trainingDay.getTrainingsDays.queryOptions({ trainingId: id }),
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);

  if (trainingStatus === "pending" || trainingDaysStatus === "pending")
    return <div>Loading...</div>;
  if (trainingStatus === "error" || trainingDaysStatus === "error") return <div>Error</div>;
  if (!trainingData || !trainingDaysData) {
    notFound();
  }

  return (
    <>
      <PageWrapper title="Training" subtitle="Full view of the training.">
        <div className="flex flex-col gap-12">
          <TrainingHero training={trainingData} />

          <div className="flex flex-col">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                Training <span className="text-amber-400">Timeline</span>
              </h2>
              <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Total Days: {trainingDaysData.length}
              </div>
            </div>

            <div className="flex flex-col">
              {trainingDaysData.map((day, index) => (
                <TrainingDayItem key={day.id} day={day} index={index} />
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
      <EditTrainingDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        training={trainingData ?? null}
      />
    </>
  );
};
