import React from "react";

import { getServerTranslations } from "@/lib/i18n/server";

const Header = async () => {
  const { t } = await getServerTranslations();

  return (
    <header className="mb-16 flex flex-col items-center text-center">
      <span className="font-black uppercase tracking-[0.4em] text-amber-400/60">
        {t("availableModules")}
      </span>
      <h2 className="mt-2 text-4xl font-black uppercase italic tracking-tighter text-zinc-100">
        {t("system")} <span className="text-amber-400">{t("capabilities")}</span>
      </h2>
    </header>
  );
};

export const MainContentAreaWrapper = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 md:px-16">
      <Header />
      {children}
    </div>
  );
};
