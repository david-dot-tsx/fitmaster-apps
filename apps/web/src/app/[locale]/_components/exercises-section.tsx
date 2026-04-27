/* eslint-disable no-console */
"use client";
import { times } from "remeda";
import { Dumbbell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/lib/i18n/server";
import { useTRPC } from "@/lib/trpc/client";

export const ExercisesSection = () => {
  const trpc = useTRPC();
  const { data: exercises, error, status } = useQuery(trpc.exercise.list.queryOptions());
  console.log("exercises", exercises);
  console.log("error", error);
  console.log("status", status);

  return (
    <div className="mt-32">
      <Header />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {times(10, (index: number) => (
          <ExerciseCard key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

const Header = async () => {
  const { t } = await getServerTranslations();

  return (
    <header className="mb-12 flex items-end justify-between border-b border-zinc-700 pb-6">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          {t("web:pages.landing.sections.exercises.header.subtitle.visualAssets")}
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-200">
          {t("web:pages.landing.sections.exercises.header.title.library")}{" "}
          <span className="text-zinc-500">
            {t("web:pages.landing.sections.exercises.header.title.preview")}
          </span>
        </h2>
      </div>
      <Button
        variant="link"
        className="text-[10px] font-black uppercase tracking-widest text-amber-400 hover:no-underline"
      >
        {t("web:pages.landing.sections.exercises.header.button.viewAllExercises")} →
      </Button>
    </header>
  );
};

const ExerciseCard = ({ index }: { index: number }) => {
  return (
    <div
      className={cn(
        "group relative aspect-square size-full overflow-hidden rounded-xl",
        "border border-zinc-700 transition-all duration-300",
        "hover:border-amber-400/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]",
        "hover:scale-95",
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Dumbbell className="size-32 text-zinc-900 duration-500 group-hover:text-zinc-800" />
      </div>
      <div
        className={cn(
          "absolute left-3 top-3 size-3 border-l border-t border-amber-400/30",
          "transition-all group-hover:left-4 group-hover:top-4 group-hover:border-l-2 group-hover:border-t-2 group-hover:border-amber-400/50",
        )}
      />
      <div
        className={cn(
          "absolute bottom-3 right-3 size-3 border-b border-r border-amber-400/30",
          "transition-all group-hover:bottom-4 group-hover:right-4 group-hover:border-b-2 group-hover:border-r-2 group-hover:border-amber-400/50",
        )}
      />

      <div className="relative flex size-full flex-col items-center justify-center">
        <div
          className={cn(
            "text-center font-mono text-sm font-black tracking-widest transition-colors group-hover:text-amber-400",
          )}
        >
          {/* TODO: Fetch api data */}
          PUSH PULL LEG
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-zinc-600">
          ID-00{index + 102}
        </div>
      </div>
    </div>
  );
};
