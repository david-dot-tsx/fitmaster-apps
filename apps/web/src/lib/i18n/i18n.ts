import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { createInstance } from "i18next";

import { initOptions, resourcesToBackendPaths, type Locale, type Namespace } from "@repo/i18n/web";

export default async function initTranslations({
  locale,
  i18nInstance,
}: {
  locale: string;
  i18nInstance?: ReturnType<typeof createInstance>;
}) {
  i18nInstance = i18nInstance || createInstance();
  i18nInstance.use(initReactI18next);

  i18nInstance.use(
    resourcesToBackend((language: Locale, namespace: Namespace) =>
      resourcesToBackendPaths(language)[namespace](),
    ),
  );

  await i18nInstance.init({
    ...initOptions,
    lng: locale,
  });

  return {
    i18n: i18nInstance,
    resources: { [locale]: i18nInstance.services.resourceStore.data[locale] },
    t: i18nInstance.t,
  };
}
