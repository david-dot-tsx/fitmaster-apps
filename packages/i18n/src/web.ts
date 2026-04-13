import { type LOCALES, type Namespace, NAMESPACES } from "./shared";

export * from "./shared";

export const resourcesToBackendPaths = (locale: (typeof LOCALES)[keyof typeof LOCALES]) => ({
  [NAMESPACES.COMMON]: () => import(`./locales/${locale}/common.json`),
  [NAMESPACES.API_ERRORS]: () => import(`./locales/${locale}/api-errors.json`),
  [NAMESPACES.WEB]: () => import(`./locales/${locale}/web.json`),
});

export type WebNamespaces = Exclude<Namespace, typeof NAMESPACES.MOBILE>;
