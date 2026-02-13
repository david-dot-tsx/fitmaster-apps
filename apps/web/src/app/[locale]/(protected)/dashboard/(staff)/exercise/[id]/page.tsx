import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { trpcServerClient } from "@/lib/trpc/client-server";
import { Button } from "@/components/ui/button";

export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await trpcServerClient.exercise.getById.query({ id });
  if (!data) notFound();

  return (
    <PageWrapper title={data.name} className="mx-auto max-w-5xl" divider={true}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              {data.bodyPart} • {data.difficulty}
            </span>
          </div>
          <Button asChild>
            <Link href={`/dashboard/exercise/${id}/edit`}>Edit</Link>
          </Button>
        </div>

        <div className="relative aspect-video max-h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          <Image src={data.imageUrl} alt={data.name} fill className="object-cover" />
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-xl font-bold text-amber-400">Description</h2>
          <p className="text-lg leading-relaxed text-slate-300">
            {data.description || "No description provided for this exercise."}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
