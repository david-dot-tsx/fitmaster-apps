import { type LOCALES } from "./types/locales";
import { NAMESPACES, NAMESPACES_KEYS } from "./types/namespaces";

export * from "./shared";

export const resourcesToBackendPaths = (locale: (typeof LOCALES)[keyof typeof LOCALES]) => ({
  [NAMESPACES.COMMON]: () => import(`./locales/${locale}/common.json`),
  [NAMESPACES.API_ERRORS]: () => import(`./locales/${locale}/api-errors.json`),
  [NAMESPACES.WEB]: () => import(`./locales/${locale}/web.json`),
});

export const I18N_NAMESPACES = {
  [NAMESPACES_KEYS.COMMON]: NAMESPACES.COMMON,
  [NAMESPACES_KEYS.API_ERRORS]: NAMESPACES.API_ERRORS,
  [NAMESPACES_KEYS.WEB]: NAMESPACES.WEB,
} as const;

export type I18nNamespaces = (typeof I18N_NAMESPACES)[keyof typeof I18N_NAMESPACES];
