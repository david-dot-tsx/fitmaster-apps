import React from "react";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { CreateTrainingDialog } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/create-training-dialog";
import { TrainingTabs } from "@/app/[locale]/(protected)/dashboard/(staff)/training/_components/training-tabs/training-tabs";
import { getSessionUser } from "@/lib/session-user";

export default async function TrainingPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser.isStaff) {
    notFound();
  }

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
