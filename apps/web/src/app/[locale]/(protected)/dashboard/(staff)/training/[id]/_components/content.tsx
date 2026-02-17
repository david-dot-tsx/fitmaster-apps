"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { notFound } from "next/navigation";

import { TrainingStatus } from "@repo/validators";

import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { EditTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/edit-training-dialog";
import { TrainingDays } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/_components/training-days";

export const TrainingContent = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const { data, status } = useQuery(trpc.training.getById.queryOptions({ id }));
  const [openEditDialog, setOpenEditDialog] = useState(false);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error</div>;
  if (!data) {
    notFound();
  }

  return (
    <>
      <PageWrapper
        title={`${data?.name ?? "Training"} ${data?.status === TrainingStatus.DRAFT ? " (Draft)" : ""}`}
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex items-end justify-end">
            <Button onClick={() => setOpenEditDialog(true)}>Edit</Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-2xl border border-white/5 bg-slate-900/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-amber-400">Info</h2>
              <div>TODO: INFO ABOUT THE TRAINING</div>
            </div>
            <div className="col-span-1">
              <div className="relative col-span-2 aspect-video max-h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                <Image
                  src={data?.imageUrl ?? ""}
                  alt={data?.name ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-3 rounded-2xl border border-white/5 bg-slate-900/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-amber-400">Description</h2>
              <p className="text-lg leading-relaxed text-slate-300">
                {data?.description || "No description provided for this training."}
              </p>
            </div>
            <TrainingDays training={data} className="col-span-3" />
          </div>
        </div>
      </PageWrapper>
      <EditTrainingDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        training={data ?? null}
      />
    </>
  );
};
