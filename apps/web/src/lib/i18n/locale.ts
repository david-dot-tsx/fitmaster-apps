import { cache } from "react";

type LocaleHolder = { locale: string };

/**
 * One mutable object per React RSC request (memoized with `cache`).
 * Must be updated from `app/[locale]/layout.tsx` via `setRequestLocale` before children run.
 */
const getLocaleHolder = cache((): LocaleHolder => ({ locale: "en" }));

/** Current `[locale]` segment for this request (server components only). */
export function getRequestLocale(): LocaleHolder {
  return getLocaleHolder();
}

/** Call once in `app/[locale]/layout.tsx` right after you read `params.locale`. */
export function setRequestLocale(locale: string): void {
  getLocaleHolder().locale = locale;
}
