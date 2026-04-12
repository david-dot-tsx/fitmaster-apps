import type { i18n } from "i18next";
import { useTranslation as useTranslationReactI18next } from "react-i18next";

import { NAMESPACES, type WebNamespaces } from "@repo/i18n/web";

import { initI18nInstance } from "@/lib/i18n/init-i18n";

type ExtraNamespace = Exclude<WebNamespaces, typeof NAMESPACES.COMMON>;

/** Client / shared entry: enables `react-i18next` (required for `I18nextProvider` + hooks). */
export default async function initTranslations({
  locale,
  i18nInstance,
}: {
  locale: string;
  i18nInstance?: i18n;
}) {
  return initI18nInstance({ locale, i18nInstance, withReactPlugin: true });
}

export function useTranslation(): ReturnType<
  typeof useTranslationReactI18next<typeof NAMESPACES.COMMON>
>;
export function useTranslation<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<typeof useTranslationReactI18next<readonly [typeof NAMESPACES.COMMON, TNamespace]>>;
export function useTranslation<const TNamespace extends ExtraNamespace>(
  namespaces?: readonly TNamespace[],
) {
  const scopedNamespaces = [NAMESPACES.COMMON, ...(namespaces ?? [])] as const;

  return useTranslationReactI18next(
    scopedNamespaces as readonly [typeof NAMESPACES.COMMON, TNamespace],
  );
}
