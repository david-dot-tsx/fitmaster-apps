import { LOCALES, type Locale } from "@repo/i18n/web";

const locales: Locale[] = Object.values(LOCALES);

export const getUnlocalizedPath = (pathname: string) => {
  const locale = locales.find((locale) => pathname.startsWith(`/${locale}`));
  if (locale) {
    const path = pathname.replace(`/${locale}`, "");

    return path === "" ? "/" : path;
  } else {
    return pathname;
  }
};
