import { type LOCALES, NAMESPACES } from "./shared";

export * from "./shared";

export const resourcesToBackendPaths = (locale: (typeof LOCALES)[keyof typeof LOCALES]) => ({
  [NAMESPACES.TRANSLATIONS]: () => import(`./locales/${locale}/translations.json`),
  [NAMESPACES.VALIDATIONS]: () => import(`./locales/${locale}/validations.json`),
});
