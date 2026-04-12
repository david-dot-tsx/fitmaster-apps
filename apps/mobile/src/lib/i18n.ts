import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next, useTranslation as useTranslationReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  resourcesToMobile,
  initOptions,
  NAMESPACES,
  type MobileNamespaces,
} from "@repo/i18n/mobile";

type ExtraNamespace = Exclude<MobileNamespaces, typeof NAMESPACES.COMMON>;

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

export function useTranslation(): ReturnType<
  typeof useTranslationReactI18next<typeof NAMESPACES.COMMON>
>;
export function useTranslation<const TNamespace extends ExtraNamespace>(
  namespaces: readonly TNamespace[],
): ReturnType<typeof useTranslationReactI18next<readonly [typeof NAMESPACES.COMMON, TNamespace]>>;
export function useTranslation<const TNamespace extends ExtraNamespace>(
  namespaces?: readonly TNamespace[],
) {
  const scopedNamespaces = [NAMESPACES.COMMON, ...(namespaces ?? [])] as const;

  return useTranslationReactI18next(
    scopedNamespaces as readonly [typeof NAMESPACES.COMMON, TNamespace],
  );
}
