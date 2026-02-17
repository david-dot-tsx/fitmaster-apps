import { type Stats } from "@/app/[locale]/(protected)/dashboard/(staff)/training/[id]/day/create/_form/components/steps/summary/summary-container";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SummaryStatsItemProps {
  label: string;
  value: string | number;
  subValue?: string;
  accentColor?: string;
  progress?: number;
}

export const SummaryStatsItem = ({
  label,
  value,
  subValue,
  accentColor = "bg-zinc-500",
  progress = 100,
}: SummaryStatsItemProps) => {
  return (
    <div className="flex flex-col gap-1.5 border-r border-zinc-800/50 px-6 first:pl-0 last:border-none">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tabular-nums tracking-tighter text-zinc-100">
          {value}
        </span>
        {subValue && (
          <span className="text-[10px] font-bold uppercase text-zinc-600">{subValue}</span>
        )}
      </div>

      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-zinc-800/50">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", accentColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface SummaryStatsProps {
  stats: Stats;
}

export const SummaryStats = ({ stats }: SummaryStatsProps) => {
  return (
    <Card className="rounded-lg border border-zinc-800 bg-background/80 shadow-green-400/15">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-8 p-6">
        <div className="flex items-center">
          <SummaryStatsItem
            label="Volume"
            value={stats.exercises.total}
            subValue="Exercises"
            accentColor="bg-amber-400"
          />
          <SummaryStatsItem
            label="Warmup"
            value={stats.exercises.warmup}
            accentColor="bg-zinc-400"
          />
          <SummaryStatsItem
            label="Main"
            value={stats.exercises.main}
            accentColor="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
          />
          <SummaryStatsItem
            label="Recovery"
            value={stats.exercises.cool}
            accentColor="bg-blue-400"
          />
        </div>

        <div className="flex items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-2xl backdrop-blur-md">
          {/* Target Body Part */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Focus
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-tighter text-amber-400">
                {stats.dominantPart}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 bg-zinc-800" />

          {/* Intensity Gauge */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Intensity
            </span>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1.5 w-5 rounded-full transition-all duration-500",
                    level <= stats.intensity
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : "bg-zinc-800",
                  )}
                />
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 bg-zinc-800" />

          {/* Weight Usage */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Weight Usage
            </span>
            <span className="text-center text-sm font-black uppercase tabular-nums text-zinc-100">
              {stats.withWeight} <span className="text-zinc-600">/</span> {stats.exercises.total}
            </span>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Card>
  );
};
