"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { initOptions, type Locale, LOCALES } from "@repo/i18n/web";

import { updateLocaleCookieAction } from "@/actions/locale.actions";

const locales = [
  { code: LOCALES.EN, name: "English", flag: "🇺🇸" },
  { code: LOCALES.PL, name: "Polski", flag: "🇵🇱" },
  { code: LOCALES.ES, name: "Español", flag: "🇪🇸" },
] as const;

// TODO: to refactor for now it's just a fast solution without styles to ensure if it works as expected
export function LocaleSwitch() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();
  const currentLocale = i18n.language;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    await updateLocaleCookieAction(newLocale as Locale, currentPathname);

    if (currentLocale === initOptions.fallbackLng) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }
  };

  return (
    <select
      onChange={handleChange}
      value={currentLocale}
      className="rounded border border-gray-300 bg-transparent p-1"
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.flag} {locale.name}
        </option>
      ))}
    </select>
  );
}
