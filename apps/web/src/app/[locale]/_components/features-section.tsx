import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/lib/i18n/server";

export const FeaturesSection = async () => {
  const { t } = await getServerTranslations();

  const features = [
    {
      id: t("web:pages.landing.sections.features.01.id"),
      title: t("web:pages.landing.sections.features.01.title"),
      desc: t("web:pages.landing.sections.features.01.description"),
    },
    {
      id: t("web:pages.landing.sections.features.02.id"),
      title: t("web:pages.landing.sections.features.02.title"),
      desc: t("web:pages.landing.sections.features.02.description"),
    },
    {
      id: t("web:pages.landing.sections.features.03.id"),
      title: t("web:pages.landing.sections.features.03.title"),
      desc: t("web:pages.landing.sections.features.03.description"),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.id}
            className={cn(
              "group relative space-y-4 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-8 transition-all",
              "hover:border-amber-400/20 hover:bg-gradient-to-br hover:from-amber-900/5 hover:to-transparent",
            )}
          >
            <span className="font-mono text-sm text-amber-400/40">{f.id}</span>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-100 transition-colors group-hover:text-amber-400">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">{f.desc}</p>
            <div className="absolute bottom-0 left-8 h-[2px] w-0 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all group-hover:w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
};
