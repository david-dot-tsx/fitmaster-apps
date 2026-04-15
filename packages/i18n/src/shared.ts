import { type ParseKeys, type InitOptions, type AppendNamespace } from "i18next";

import type Resources from "./resources";
import { type Namespace, NAMESPACES } from "./types/namespaces";
import { LOCALES, type Locale } from "./types/locales";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: Namespace;
    resources: Resources;
  }
}

export const initOptions = {
  debug: false,
  fallbackLng: LOCALES.EN,
  load: "languageOnly",
  ns: [NAMESPACES.COMMON, NAMESPACES.API_ERRORS],
  defaultNS: NAMESPACES.COMMON,
} satisfies InitOptions;

export type ResourcesType = Resources;

export { type Locale, LOCALES };

export function getTKey<TKey extends AppendNamespace<Namespace, ParseKeys<Namespace>>>(key: TKey) {
  return key;
}
