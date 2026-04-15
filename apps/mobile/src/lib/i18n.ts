import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  resourcesToMobile,
  initOptions,
  I18N_NAMESPACES,
  type I18nNamespaces,
} from "@repo/i18n/mobile";

const PRELOADED_NAMESPACES = [I18N_NAMESPACES.COMMON, I18N_NAMESPACES.MOBILE] as const;
type ExtraNamespace = Exclude<I18nNamespaces, (typeof PRELOADED_NAMESPACES)[number]>;

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem("user-language").then((savedLanguage) => {
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      const systemLanguage = Localization.getLocales()[0]?.languageCode;
      callback(systemLanguage || initOptions.fallbackLng);
    });
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    await AsyncStorage.setItem("user-language", lng);
  },
};

const i18nextInstance = i18n;

i18nextInstance
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    ...initOptions,
    resources: resourcesToMobile,
  });

export default i18nextInstance;

export function useT(): ReturnType<typeof useTranslation<typeof PRELOADED_NAMESPACES>>;

export function useT<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<typeof useTranslation<readonly [...typeof PRELOADED_NAMESPACES, TNamespace]>>;

export function useT<const TNamespace extends ExtraNamespace>(namespaces?: readonly TNamespace[]) {
  const scopedNamespaces = [...PRELOADED_NAMESPACES, ...(namespaces ?? [])] as const;

  return useTranslation(scopedNamespaces);
}
