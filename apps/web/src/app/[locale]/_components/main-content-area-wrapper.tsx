import { t } from "i18next";
import React from "react";

import { getServerTranslations } from "@/lib/i18n/server";

const Header = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslations(locale);

  return (
    <header className="mb-16 flex flex-col items-center text-center">
      <span className="text-2xs font-black uppercase tracking-[0.4em] text-amber-400/60">
        {/* Available Modules */}
        {t("availableModules")}
      </span>
      <h2 className="mt-2 text-4xl font-black uppercase italic tracking-tighter text-zinc-100">
        {/* System <span className="text-amber-400">Capabilities</span> */}
        {t("system")} <span className="text-amber-400">{t("systemCapabilities")}</span>
      </h2>
    </header>
  );
};

export const MainContentAreaWrapper = async ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 md:px-16">
      <Header locale={locale} />
      {children}
    </div>
  );
};
