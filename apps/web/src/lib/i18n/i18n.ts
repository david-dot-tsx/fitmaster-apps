import type { i18n } from "i18next";
import { useTranslation as useTranslationReactI18next } from "react-i18next";

import { I18N_NAMESPACES, type I18nNamespaces } from "@repo/i18n/web";

import { initI18nInstance } from "@/lib/i18n/init-i18n";

const PRELOADED_NAMESPACES = [I18N_NAMESPACES.COMMON, I18N_NAMESPACES.WEB] as const;

type ExtraNamespace = Exclude<I18nNamespaces, (typeof PRELOADED_NAMESPACES)[number]>;

export default async function initTranslations({
  locale,
  i18nInstance,
}: {
  locale: string;
  i18nInstance?: i18n;
}) {
  return initI18nInstance({ locale, i18nInstance, withReactPlugin: true });
}

export function useT(): ReturnType<typeof useTranslationReactI18next<typeof PRELOADED_NAMESPACES>>;

export function useT<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<
  typeof useTranslationReactI18next<readonly [...typeof PRELOADED_NAMESPACES, TNamespace]>
>;

export function useT<const TNamespace extends ExtraNamespace>(namespaces?: readonly TNamespace[]) {
  const scopedNamespaces = [...PRELOADED_NAMESPACES, ...(namespaces ?? [])] as const;

  return useTranslationReactI18next(scopedNamespaces);
}
