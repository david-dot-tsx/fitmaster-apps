import React from "react";

import { useT } from "@/lib/i18n/i18n";
import { type DayCreatorStep } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/consts/steps";
import { cn } from "@/lib/utils";
import { stepConfig } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/day-create-content";

export const StepHeader = ({ step }: { step: DayCreatorStep }) => {
  const config = stepConfig[step];
  const { t } = useT();

  return (
    <div className="mb-8 mt-4 flex items-center gap-6">
      <div className="relative">
        <div className={cn("absolute inset-0 opacity-20 blur-xl", config.accent)} />
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
          {config.icon}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", config.accent)} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            {t("web:pages.trainingDayCreator.stepper.currentBlock")}
          </span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-100">{t(config.label)}</h2>
        <p className="max-w-md text-sm text-zinc-500">{t(config.description)}</p>
      </div>
    </div>
  );
};
