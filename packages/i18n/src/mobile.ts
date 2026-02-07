import { LOCALES, NAMESPACES } from "./shared";
import plCommon from "./locales/pl/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import plApiErrors from "./locales/pl/api-errors.json";
import enApiErrors from "./locales/en/api-errors.json";
import esApiErrors from "./locales/es/api-errors.json";

export * from "./shared";

export const resourcesToMobile = {
  [LOCALES.PL]: {
    [NAMESPACES.COMMON]: plCommon,
    [NAMESPACES.API_ERRORS]: plApiErrors,
  },
  [LOCALES.EN]: {
    [NAMESPACES.COMMON]: enCommon,
    [NAMESPACES.API_ERRORS]: enApiErrors,
  },
  [LOCALES.ES]: {
    [NAMESPACES.COMMON]: esCommon,
    [NAMESPACES.API_ERRORS]: esApiErrors,
  },
};
