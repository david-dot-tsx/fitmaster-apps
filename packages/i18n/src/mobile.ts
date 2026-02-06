import { LOCALES, NAMESPACES } from "./shared";
import plTranslations from "./locales/pl/translations.json";
import enTranslations from "./locales/en/translations.json";
import esTranslations from "./locales/es/translations.json";
import plValidations from "./locales/pl/validations.json";
import enValidations from "./locales/en/validations.json";
import esValidations from "./locales/es/validations.json";

export * from "./shared";

export const resourcesToMobile = {
  [LOCALES.PL]: {
    [NAMESPACES.TRANSLATIONS]: plTranslations,
    [NAMESPACES.VALIDATIONS]: plValidations,
  },
  [LOCALES.EN]: {
    [NAMESPACES.TRANSLATIONS]: enTranslations,
    [NAMESPACES.VALIDATIONS]: enValidations,
  },
  [LOCALES.ES]: {
    [NAMESPACES.TRANSLATIONS]: esTranslations,
    [NAMESPACES.VALIDATIONS]: esValidations,
  },
};
