import React from "react";

import { TrainingStatus } from "@repo/validators";
import { getTKey } from "@repo/i18n/web";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingTab } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-tab";
import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/lib/i18n/server";

const TABS = {
  UNPUBLISHED: {
    label: getTKey("common:unpublished"),
    value: "unpublished",
    statuses: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
  },
  PUBLISHED: {
    label: getTKey("common:published"),
    value: "published",
    statuses: [TrainingStatus.PUBLISHED],
  },
  EXPIRING: {
    label: getTKey("common:expiring"),
    value: "expiring",
    statuses: [TrainingStatus.HIDDEN, TrainingStatus.DISABLED],
  },
};
export const TrainingTabs = async () => {
  const { t } = await getServerTranslations();

  return (
    <Tabs defaultValue={TABS.UNPUBLISHED.value} className="w-full space-y-8">
      <TabsList className="h-12 w-full justify-start gap-2 rounded-xl border border-zinc-800/50 bg-zinc-950/50 p-1.5 backdrop-blur-md md:w-fit">
        {Object.values(TABS).map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "group",
              "relative h-full px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
              "data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-300",
              "data-[state=active]:bg-zinc-900 data-[state=active]:text-amber-400 data-[state=active]:shadow-[0_0_15px_rgba(251,191,36,0.1)]",
            )}
          >
            <span className="flex items-center gap-2">
              <div
                className={cn(
                  "size-1 rounded-full transition-all duration-500",
                  "bg-zinc-800 group-data-[state=active]:bg-amber-400 group-data-[state=active]:shadow-[0_0_8px_rgba(251,191,36,0.8)]",
                )}
              />
              {t(tab.label)}
            </span>

            <div
              className={cn(
                "absolute inset-x-4 bottom-1 hidden h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent data-[state=active]:block",
                "group-data-[state=active]:block",
              )}
            />
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.values(TABS).map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 ring-offset-background focus-visible:outline-none"
        >
          <div className="duration-500 animate-in fade-in slide-in-from-bottom-2">
            <TrainingTab statuses={tab.statuses} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
