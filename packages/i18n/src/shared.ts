import { type InitOptions } from "i18next";

import type Resources from "./resources";

/**
 * TODO:
 *  - create an object with available languages and infer type from it
 *  - create a const with available namespaces and infer type from it
 *
 *  - Good practice in NextJS to keep tranlations per page in separated files.
 *    To figure out how to handle this, and also satisfy the mobile app.
 *
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translations";
    resources: Resources;
  }
}

export const LOCALES = {
  PL: "pl",
  EN: "en",
  ES: "es",
} as const;
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const NAMESPACES = {
  TRANSLATIONS: "translations",
  VALIDATIONS: "validations",
} as const;
export type Namespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];

export const initOptions = {
  debug: false,
  fallbackLng: LOCALES.EN,
  load: "languageOnly",
  ns: [NAMESPACES.TRANSLATIONS, NAMESPACES.VALIDATIONS],
  defaultNS: "translations",
} satisfies InitOptions;

export type ResourcesType = Resources;
