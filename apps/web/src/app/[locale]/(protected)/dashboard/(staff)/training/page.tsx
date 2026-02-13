import React from "react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { CreateTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/create-training-dialog";
import { TrainingTabs } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-tabs";

export default function TrainingPage() {
  return (
    <PageWrapper title="Training">
      <div className="flex w-full flex-col">
        <div className="flex flex-row justify-end">
          <CreateTrainingDialog />
        </div>
        <TrainingTabs />
      </div>
    </PageWrapper>
  );
}
