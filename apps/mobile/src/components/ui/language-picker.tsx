import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

import { LOCALES } from "@repo/i18n/mobile";

const LANGUAGES = [
  { code: LOCALES.EN, label: "English", flag: "🇺🇸" },
  { code: LOCALES.PL, label: "Polski", flag: "🇵🇱" },
  { code: LOCALES.ES, label: "Español", flag: "🇪🇸" },
];

export function LanguagePicker() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <View className="rounded-2xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-4 text-lg font-semibold text-gray-800">
        {t("settings.language_title", "Wybierz język")}
      </Text>

      <View className="space-y-2">
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;

          return (
            <Pressable
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              className={`flex-row items-center rounded-xl border p-4 ${
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
              }`}
            >
              <Text className="mr-3 text-2xl">{lang.flag}</Text>

              <Text
                className={`flex-1 text-base ${
                  isActive ? "font-bold text-blue-600" : "text-gray-700"
                }`}
              >
                {lang.label}
              </Text>

              {isActive && (
                <View className="rounded-full bg-blue-500 p-1">
                  <Text className="text-xs text-white">✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
