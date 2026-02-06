import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { resourcesToMobile, initOptions } from "@repo/i18n/mobile";

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
