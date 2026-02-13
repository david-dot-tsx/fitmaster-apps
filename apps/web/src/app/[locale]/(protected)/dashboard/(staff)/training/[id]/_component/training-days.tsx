import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const TrainingDays = ({ className }: { className?: string }) => {
  return (
    <div className={cn("rounded-2xl border border-white/5 bg-slate-900/50 p-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold text-amber-400">Training Days</h2>
        {/* // TODO: Link to create training day page */}
        <Button>Create Training Day</Button>
      </div>
      <p className="text-lg leading-relaxed text-slate-300">TODO: TRAINING DAYS TABLE</p>
    </div>
  );
};
