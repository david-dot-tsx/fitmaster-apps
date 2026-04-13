import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/lib/i18n/server";

export const StatsSection = async () => {
  const { t } = await getServerTranslations();

  return (
    <section className="border-y border-zinc-900 bg-black/40 py-20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-around gap-12 px-6">
        <StatBox
          label={t("web:pages.landing.sections.stats.activeUsers")}
          value="12.4K"
          accent="bg-amber-400"
        />
        <StatBox
          label={t("web:pages.landing.sections.stats.launchedWorkouts")}
          value="1.2M"
          accent="bg-blue-400"
        />
        <StatBox
          label={t("web:pages.landing.sections.stats.satisfiedClients")}
          value="99.9%"
          accent="bg-emerald-400"
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{label}</span>
    <span className="text-5xl font-black uppercase italic tracking-tighter text-zinc-100">
      {value}
    </span>
    <div className={cn("h-1 w-12 rounded-full opacity-50", accent)} />
  </div>
);
