import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  resourcesToMobile,
  initOptions,
  NAMESPACES,
  type MobileNamespaces,
} from "@repo/i18n/mobile";

const DEFAULT_MOBILE_NAMESPACES = [NAMESPACES.COMMON, NAMESPACES.MOBILE] as const;
type ExtraNamespace = Exclude<MobileNamespaces, (typeof DEFAULT_MOBILE_NAMESPACES)[number]>;

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

export function useT(): ReturnType<typeof useTranslation<typeof DEFAULT_MOBILE_NAMESPACES>>;

export function useT<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<typeof useTranslation<readonly [...typeof DEFAULT_MOBILE_NAMESPACES, TNamespace]>>;

export function useT<const TNamespace extends ExtraNamespace>(namespaces?: readonly TNamespace[]) {
  const scopedNamespaces = [...DEFAULT_MOBILE_NAMESPACES, ...(namespaces ?? [])] as const;

  return useTranslation(scopedNamespaces);
}
