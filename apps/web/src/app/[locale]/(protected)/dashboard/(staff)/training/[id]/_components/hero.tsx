import Image from "next/image";

import { type Training } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/web";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/i18n";

export const TrainingHero = ({ training }: { training: Training }) => {
  const { t } = useTranslation([NAMESPACES.WEB]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 size-64 bg-amber-400/10 blur-[100px]" />

      <div className="flex flex-col gap-8 p-8 md:flex-row">
        {/* Cover Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl md:w-72">
          <Image
            src={training.imageUrl || "/assets/placeholder.png"}
            alt={training.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <Badge className="absolute right-4 top-4 bg-amber-400 text-[10px] font-black uppercase leading-tight text-black">
            {training.status}
          </Badge>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-100">
              {training.name}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
              {training.description || "—"}
            </p>
          </div>

          <div className="mt-2 flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {t("web:pages.trainingDetail.hero.createdAt")}
              </span>
              <span className="text-sm font-bold text-zinc-300">
                {new Date(training.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {t("web:pages.trainingDetail.hero.id")}
              </span>
              <span className="font-mono text-sm font-bold tracking-tighter text-zinc-300">
                {training.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
