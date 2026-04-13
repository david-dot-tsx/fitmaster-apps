import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "lucide-react-native";

import { LOCALES, NAMESPACES } from "@repo/i18n/mobile";

import { Icon } from "@/components/ui/icon";

export function LanguagePicker() {
  const { i18n, t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const LANGUAGES = useMemo(
    () => [
      { code: LOCALES.EN, label: t("languages.english"), flag: "🇺🇸" },
      { code: LOCALES.PL, label: t("languages.polish"), flag: "🇵🇱" },
      { code: LOCALES.ES, label: t("languages.spanish"), flag: "🇪🇸" },
    ],
    [t],
  );

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <View className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <Text className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
        {t("selectYourLanguage")}
      </Text>

      <View className="space-y-2">
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;

          return (
            <Pressable
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              className={`flex-row items-center rounded-xl border p-4 ${
                isActive ? "border-amber-400/50 bg-zinc-900/60" : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <Text className="mr-3 text-2xl">{lang.flag}</Text>

              <Text
                className={`flex-1 text-base ${
                  isActive ? "font-bold text-amber-400" : "text-zinc-300"
                }`}
              >
                {lang.label}
              </Text>

              {isActive && (
                <View className="rounded-full bg-amber-400/20 p-1">
                  <Icon as={CheckIcon} size="sm" className="text-amber-400" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
