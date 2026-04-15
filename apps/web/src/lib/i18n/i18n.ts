import type { i18n } from "i18next";
import { useTranslation as useTReactI18next } from "react-i18next";

import { NAMESPACES, type WebNamespaces } from "@repo/i18n/web";

import { initI18nInstance } from "@/lib/i18n/init-i18n";

const DEFAULT_WEB_NAMESPACES = [NAMESPACES.COMMON, NAMESPACES.WEB] as const;

type ExtraNamespace = Exclude<WebNamespaces, (typeof DEFAULT_WEB_NAMESPACES)[number]>;

export default async function initTranslations({
  locale,
  i18nInstance,
}: {
  locale: string;
  i18nInstance?: i18n;
}) {
  return initI18nInstance({ locale, i18nInstance, withReactPlugin: true });
}

export function useT(): ReturnType<typeof useTReactI18next<typeof DEFAULT_WEB_NAMESPACES>>;

export function useT<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<typeof useTReactI18next<readonly [...typeof DEFAULT_WEB_NAMESPACES, TNamespace]>>;

export function useT<const TNamespace extends ExtraNamespace>(namespaces?: readonly TNamespace[]) {
  const scopedNamespaces = [...DEFAULT_WEB_NAMESPACES, ...(namespaces ?? [])] as const;

  return useTReactI18next(scopedNamespaces);
}
