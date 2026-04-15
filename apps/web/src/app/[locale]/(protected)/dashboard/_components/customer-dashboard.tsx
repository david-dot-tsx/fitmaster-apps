import { Smartphone, Apple, Play, QrCode } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { getServerTranslations } from "@/lib/i18n/server";

export const CustomerDashboard = async () => {
  const { t } = await getServerTranslations();

  return (
    <PageWrapper
      title={t("web:pages.dashboard.customer.title")}
      subtitle={t("web:pages.dashboard.customer.subtitle")}
      eyebrow={t("web:pages.dashboard.customer.eyebrow")}
    >
      <div className="flex h-full items-center justify-center">
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8 backdrop-blur-xl transition-all duration-500 hover:border-amber-400/30">
          <div className="absolute -left-full -top-full size-[400%] rotate-[15deg] bg-gradient-to-tr from-amber-400/30 via-transparent to-transparent transition-all duration-500 ease-in-out group-hover:-left-1/2 group-hover:-top-1/2" />

          <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
            <div className="relative flex size-32 shrink-0 items-center justify-center">
              <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-3xl border-2 border-dashed border-zinc-800" />
              <div className="absolute inset-4 flex items-center justify-center rounded-xl border border-amber-400/20 bg-zinc-900 shadow-[0_0_20px_rgba(251,191,36,0.05)]">
                <Smartphone className="text-amber-400" size={40} strokeWidth={1.5} />
              </div>
              <div className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                  {t("web:pages.dashboard.customer.getReadyForTraining")}
                </span>
                <div className="h-px w-12 bg-zinc-800" />
              </div>

              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-100">
                {t("web:pages.dashboard.customer.startYour")}{" "}
                <span className="text-amber-400">{t("web:pages.dashboard.customer.workout")}</span>
              </h2>

              <p className="mt-4 max-w-md text-xs font-medium uppercase leading-relaxed tracking-tight text-zinc-500">
                {t(
                  "web:pages.dashboard.customer.description.toStartYourFirstSessionAndTrackYourProgress",
                )}{" "}
                <span className="ml-1 text-zinc-300">
                  {t("web:pages.dashboard.customer.description.mobileApp")}
                </span>
                .
                {t(
                  "web:pages.dashboard.customer.description.downloadItBelowAndLogInToSyncYourData",
                )}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <button className="group/btn relative flex items-center gap-3 overflow-hidden rounded-lg bg-zinc-100 px-6 py-3 transition-all active:scale-95">
                  <Apple size={18} fill="black" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">
                    {t("appStore")}
                  </span>
                </button>

                <button className="group/btn relative flex items-center gap-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 transition-all hover:border-zinc-700 active:scale-95">
                  <Play size={18} className="text-zinc-400" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {t("googlePlay")}
                  </span>
                </button>
              </div>
            </div>

            <div className="hidden rounded-xl border border-zinc-600 bg-zinc-900/80 p-4 lg:block">
              <div className="flex size-24 items-center justify-center rounded border border-dashed border-zinc-500 bg-zinc-800/50">
                <QrCode size={54} className="text-zinc-600" />
              </div>
              <span className="mt-2 block text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t("quickScan")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
