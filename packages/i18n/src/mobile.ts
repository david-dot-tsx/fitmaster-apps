import { LOCALES, NAMESPACES } from "./shared";
import plCommon from "./locales/pl/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import plValidations from "./locales/pl/validations.json";
import enValidations from "./locales/en/validations.json";
import esValidations from "./locales/es/validations.json";

export * from "./shared";

export const resourcesToMobile = {
  [LOCALES.PL]: {
    [NAMESPACES.COMMON]: plCommon,
    [NAMESPACES.VALIDATIONS]: plValidations,
  },
  [LOCALES.EN]: {
    [NAMESPACES.COMMON]: enCommon,
    [NAMESPACES.VALIDATIONS]: enValidations,
  },
  [LOCALES.ES]: {
    [NAMESPACES.COMMON]: esCommon,
    [NAMESPACES.VALIDATIONS]: esValidations,
  },
};
