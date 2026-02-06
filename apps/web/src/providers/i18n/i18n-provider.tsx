"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import { createInstance } from "i18next";

import initTranslations from "@/lib/i18n/i18n";

const i18n = createInstance();

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initTranslations({
        locale,
        i18nInstance: i18n,
      });
      setIsInitialized(true);
    };

    init();
  }, [locale]);

  if (!isInitialized) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
