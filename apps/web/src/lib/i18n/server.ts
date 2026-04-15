"use server";
import { cache } from "react";
import { cookies } from "next/headers";

import { LOCALES } from "@repo/i18n/web";

import { initI18nInstance } from "@/lib/i18n/init-i18n";
import { COOKIES_NAMES } from "@/consts/cookies";

export type ServerTranslations = Awaited<ReturnType<typeof initI18nInstance>>;

/**
 * Server-only i18n for React Server Components.
 *
 * Uses the same resources as the client but **does not** load `react-i18next` / `createContext`
 * (those break under Next’s RSC React entry).
 *
 * Wrapped in React `cache()` so each request dedupes by `locale`.
 */
export const getServerTranslations = cache(async (): Promise<ServerTranslations> => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIES_NAMES.LOCALE)?.value;

  return initI18nInstance({ locale: cookieLocale ?? LOCALES.EN, withReactPlugin: false });
});
