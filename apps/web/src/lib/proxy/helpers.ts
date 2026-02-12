import "server-only";
import { type NextResponse, type NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { addYears } from "date-fns";

import { initOptions, LOCALES, type Locale } from "@repo/i18n/web";

import { UNLOCALIZED_PUBLIC_PATHS } from "@/lib/proxy/consts/unlocalized-public-paths";
import { type CookieSetupParams } from "@/lib/proxy/types/cookie-setup-params";
import { COOKIES_NAMES } from "@/consts/cookies";

const locales: Locale[] = Object.values(LOCALES);
acceptLanguage.languages(locales);

export const isPathWithoutLocale = (pathname: string): boolean => {
  return !locales.some((locale) => pathname.startsWith(`/${locale}`));
};

export const getCookieLocale = (request: NextRequest) => {
  if (request.cookies.has(COOKIES_NAMES.LOCALE)) {
    return acceptLanguage.get(request.cookies.get(COOKIES_NAMES.LOCALE)?.value);
  }

  return undefined;
};

export const getCurrentPathLocale = (request: NextRequest) => {
  return locales.find((locale) => request.nextUrl.pathname.startsWith(`/${locale}`));
};

export const getAcceptLanguageHeaderLocale = (request: NextRequest) => {
  return acceptLanguage.get(request.headers.get("accept-language"));
};

export const getFallbackLocale = () => {
  return initOptions.fallbackLng;
};

export const setLocaleCookie = (response: NextResponse, locale: string) => {
  const localeCookieSettings: CookieSetupParams = {
    name: COOKIES_NAMES.LOCALE,
    value: undefined,
    cookieSettings: {
      path: "/",
      httpOnly: true,
      expires: addYears(Date.now(), 1),
    },
  };
  response.cookies.set(localeCookieSettings.name, locale, localeCookieSettings.cookieSettings);
};

export const getUrlWithLocale = (pathname: string, request: NextRequest, locale: string) => {
  return new URL(`/${locale}${pathname}`, request.url);
};

export const isLocalizedPath = (pathname: string) => {
  return locales.some((locale) => pathname.startsWith(`/${locale}`));
};

export const getUnlocalizedPath = (pathname: string) => {
  const locale = locales.find((locale) => pathname.startsWith(`/${locale}`));
  if (locale) {
    const path = pathname.replace(`/${locale}`, "");

    return path === "" ? "/" : path;
  } else {
    return pathname;
  }
};

export const isPathPublic = (pathname: string) => {
  const unlocalizedPathname = getUnlocalizedPath(pathname);

  return UNLOCALIZED_PUBLIC_PATHS.includes(unlocalizedPathname);
};
