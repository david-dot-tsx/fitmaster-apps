import React from "react";
import Link from "next/link";

import { type Training } from "@repo/validators";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const TrainingDays = ({
  training,
  className,
}: {
  training: Training;
  className?: string;
}) => {
  return (
    <div className={cn("rounded-2xl border border-white/5 bg-slate-900/50 p-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold text-amber-400">Training Days</h2>
        {/* // TODO: Link to create training day page */}
        <Button asChild>
          <Link href={`/dashboard/training/${training.id}/day/create`}>Create Training Day</Link>
        </Button>
      </div>
      <p className="text-lg leading-relaxed text-slate-300">TODO: TRAINING DAYS TABLE</p>
    </div>
  );
};
