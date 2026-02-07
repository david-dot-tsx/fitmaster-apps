import { type InitOptions } from "i18next";

import type Resources from "./resources";
export * from "./utils/api-error";

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
    defaultNS: Namespace;
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
  COMMON: "common",
  API_ERRORS: "api-errors",
} as const;
export type Namespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];

export const initOptions = {
  debug: false,
  fallbackLng: LOCALES.EN,
  load: "languageOnly",
  ns: [NAMESPACES.COMMON, NAMESPACES.API_ERRORS],
  defaultNS: NAMESPACES.COMMON,
} satisfies InitOptions;

export type ResourcesType = Resources;
