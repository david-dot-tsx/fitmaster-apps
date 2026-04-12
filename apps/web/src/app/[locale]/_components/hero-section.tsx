import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getServerTranslations } from "@/lib/i18n/server";
import { getRequestLocale } from "@/lib/i18n/locale";

export const HeroSection = async () => {
  const { t } = await getServerTranslations(getRequestLocale().locale);

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 size-full">
        <Image
          src="/assets/bg-landing.jpg"
          alt="Training Background"
          width={1920}
          height={1080}
          className="object-cover opacity-100 brightness-75 contrast-100 grayscale"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,100),transparent_55%)]" />
      </div>
      <div className="relative z-10 space-y-6 text-center">
        {/* Eyebrow */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1 backdrop-blur-md">
          <div className="size-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
            {/* MOBILE APP AVAILABLE NOW */}
            {t("mobileAppAvailableNow")}
          </span>
        </div>
        {/* // TODO: TO DELETE TEST ONLY */}
        <div className="absolute z-20 min-w-[70%] rounded-xl bg-green-950 p-12 text-white">
          <div>{t("register")}</div>
          <div>{getRequestLocale().locale}</div>
        </div>
        {/* Main H1 */}
        <h1 className="max-w-4xl text-6xl font-black uppercase italic tracking-tighter text-zinc-100 md:text-8xl lg:text-9xl">
          {t("forgeYour")} <span className="text-glow text-amber-400">{t("limits")}</span>
          <span className="text-zinc-500">{t("dot")}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-zinc-300 drop-shadow-2xl">
          {/* Access to personalized training protocols that will push your boundaries. Technology used
          by professional athletes, now at your fingertips. */}
          {t("accessToPersonalizedTrainingProtocols")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
          <Button
            size="lg"
            className="h-14 bg-amber-400 px-8 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:bg-amber-500"
          >
            {/* Initialize Access */}
            {t("initializeAccess")}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-14 border border-zinc-800 px-8 font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900/50"
          >
            {/* View Protocol */}
            {t("viewProtocol")}
          </Button>
        </div>
      </div>
    </section>
  );
};
