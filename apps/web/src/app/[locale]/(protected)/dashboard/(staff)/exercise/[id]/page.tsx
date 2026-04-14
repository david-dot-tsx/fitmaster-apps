import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { trpcServerClient } from "@/lib/trpc/client-server";
import { getServerTranslations } from "@/lib/i18n/server";
import { ExerciseActions } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/[id]/_components/exercise-actions";

export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await trpcServerClient.exercise.getById.query({ id });
  const { t } = await getServerTranslations();
  if (!data) notFound();

  return (
    <PageWrapper
      title={data.name}
      subtitle={t("web:pages.exercise-detail.subtitle")}
      eyebrow={t("web:pages.exercise-detail.eyebrow")}
      className=""
      divider={true}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              {data.bodyPart} • {data.difficulty}
            </span>
          </div>
          <ExerciseActions exercise={data} />
        </div>

        <div className="relative aspect-video max-h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          <Image src={data.imageUrl} alt={data.name} fill className="object-cover" />
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-xl font-bold capitalize text-amber-400">{t("description")}</h2>
          <p className="text-lg leading-relaxed text-slate-300">
            {data.description ||
              t("web:pages.exercise-detail.noDescriptionProvidedForThisExercise")}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
