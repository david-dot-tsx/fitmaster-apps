import plCommon from "./locales/pl/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import plApiErrors from "./locales/pl/api-errors.json";
import enApiErrors from "./locales/en/api-errors.json";
import esApiErrors from "./locales/es/api-errors.json";
import plMobile from "./locales/pl/mobile.json";
import enMobile from "./locales/en/mobile.json";
import esMobile from "./locales/es/mobile.json";
import { NAMESPACES, NAMESPACES_KEYS } from "./types/namespaces";
import { LOCALES } from "./types/locales";

export * from "./shared";

export const resourcesToMobile = {
  [LOCALES.PL]: {
    [NAMESPACES.COMMON]: plCommon,
    [NAMESPACES.API_ERRORS]: plApiErrors,
    [NAMESPACES.MOBILE]: plMobile,
  },
  [LOCALES.EN]: {
    [NAMESPACES.COMMON]: enCommon,
    [NAMESPACES.API_ERRORS]: enApiErrors,
    [NAMESPACES.MOBILE]: enMobile,
  },
  [LOCALES.ES]: {
    [NAMESPACES.COMMON]: esCommon,
    [NAMESPACES.API_ERRORS]: esApiErrors,
    [NAMESPACES.MOBILE]: esMobile,
  },
};

export const I18N_NAMESPACES = {
  [NAMESPACES_KEYS.COMMON]: NAMESPACES.COMMON,
  [NAMESPACES_KEYS.API_ERRORS]: NAMESPACES.API_ERRORS,
  [NAMESPACES_KEYS.MOBILE]: NAMESPACES.MOBILE,
};

export type I18nNamespaces = (typeof I18N_NAMESPACES)[keyof typeof I18N_NAMESPACES];
