import React from "react";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { CreateTrainingDialog } from "@/features/staff-training/create-training-dialog";
import { TrainingTabs } from "@/features/staff-training/training-tabs/training-tabs";
import { getSessionUser } from "@/lib/session-user";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function TrainingPage() {
  const { t } = await getServerTranslations();
  const sessionUser = await getSessionUser();
  if (!sessionUser.isStaff) {
    notFound();
  }

  return (
    <PageWrapper
      title={t("web:pages.trainingList.title")}
      subtitle={t("web:pages.trainingList.subtitle")}
      eyebrow={t("web:pages.trainingList.eyebrow")}
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-row justify-end">
          <CreateTrainingDialog />
        </div>
        <TrainingTabs />
      </div>
    </PageWrapper>
  );
}
