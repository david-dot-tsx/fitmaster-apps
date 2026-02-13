import React from "react";

import { TrainingStatus } from "@repo/validators";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingTab } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-tab";

const TABS = {
  UNPUBLISHED: {
    label: "Unpublished",
    value: "unpublished",
    statuses: [TrainingStatus.DRAFT, TrainingStatus.READY_TO_PUBLISH],
  },
  PUBLISHED: {
    label: "Published",
    value: "published",
    statuses: [TrainingStatus.PUBLISHED],
  },
  EXPIRING: {
    label: "Expiring",
    value: "expiring",
    statuses: [TrainingStatus.HIDDEN, TrainingStatus.BLOCKED],
  },
};
export const TrainingTabs = () => {
  return (
    <Tabs defaultValue={TABS.UNPUBLISHED.value}>
      <TabsList>
        <TabsTrigger value={TABS.UNPUBLISHED.value}>{TABS.UNPUBLISHED.label}</TabsTrigger>
        <TabsTrigger value={TABS.PUBLISHED.value}>{TABS.PUBLISHED.label}</TabsTrigger>
        <TabsTrigger value={TABS.EXPIRING.value}>{TABS.EXPIRING.label}</TabsTrigger>
      </TabsList>
      <TabsContent value={TABS.UNPUBLISHED.value}>
        <TrainingTab statuses={TABS.UNPUBLISHED.statuses} />
      </TabsContent>
      <TabsContent value={TABS.PUBLISHED.value}>
        <TrainingTab statuses={TABS.PUBLISHED.statuses} />
      </TabsContent>
      <TabsContent value={TABS.EXPIRING.value}>
        <TrainingTab statuses={TABS.EXPIRING.statuses} />
      </TabsContent>
    </Tabs>
  );
};
