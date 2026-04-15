import resourcesToBackend from "i18next-resources-to-backend";
import { createInstance } from "i18next";

import {
  initOptions,
  resourcesToBackendPaths,
  I18N_NAMESPACES,
  type Locale,
  type I18nNamespaces,
} from "@repo/i18n/web";

export type InitI18nOptions = {
  locale: string;
  i18nInstance?: ReturnType<typeof createInstance>;
  /**
   * `react-i18next` registers React hooks and uses `createContext`, which is not available in the
   * React build used for Server Components. Keep `false` for RSC; use `true` only with the client
   * `I18nProvider` / `I18nextProvider`.
   */
  withReactPlugin?: boolean;
};

/**
 * Shared i18next bootstrap for web (same resources and options as the client).
 */
export async function initI18nInstance({
  locale = "",
  i18nInstance,
  withReactPlugin = false,
}: InitI18nOptions) {
  const instance = i18nInstance ?? createInstance();

  if (withReactPlugin) {
    const { initReactI18next } = await import("react-i18next/initReactI18next");
    instance.use(initReactI18next);
  }

  instance.use(
    resourcesToBackend((language: Locale, namespace: I18nNamespaces) => {
      return resourcesToBackendPaths(language)[namespace]();
    }),
  );

  await instance.init({
    ...initOptions,
    ns: [...initOptions.ns, I18N_NAMESPACES.WEB],
    defaultNS: I18N_NAMESPACES.COMMON,
    lng: locale,
  });

  return {
    i18n: instance,
    resources: { [locale]: instance.services.resourceStore.data[locale] },
    t: instance.t,
  };
}
