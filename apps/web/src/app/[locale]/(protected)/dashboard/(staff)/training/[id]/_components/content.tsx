"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { useTRPC } from "@/lib/trpc/client";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { EditTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/edit-training-dialog";
import { TrainingHero } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_components/hero";
import { TrainingDayItem } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_components/training-day-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TrainingContent = ({ id }: { id: string }) => {
  const router = useRouter();
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
              <div className="flex flex-row items-center justify-between gap-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                  Training <span className="text-amber-400">Timeline</span>
                </h2>
                <div className="self-end rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Total Days: {trainingDaysData.length}
                </div>
              </div>
              <Button className="bg-amber-400 font-black uppercase tracking-widest text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-amber-500">
                <PlusIcon className="mr-2 size-4 stroke-[3px]" />
                Add Day
              </Button>
            </div>

            <div className="flex flex-col">
              {trainingDaysData.map((day, index) => (
                <TrainingDayItem key={day.id} day={day} index={index} />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.push(`/dashboard/training/${id}/day/create`);
                }}
                className={cn(
                  "group relative ml-12 h-auto rounded-2xl border-dashed border-zinc-800 bg-zinc-900/20 py-8 transition-all duration-300",
                  "hover:border-amber-400/50 hover:bg-amber-400/5 hover:text-amber-400",
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-amber-400/50 group-hover:bg-zinc-800">
                    <PlusIcon className="size-5 transition-transform group-hover:rotate-90" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Add new Training Day
                  </span>
                </div>
              </Button>
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
