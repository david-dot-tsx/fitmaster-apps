import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { addYears } from "date-fns";

import { initOptions, LOCALES, type Locale } from "@repo/i18n/web";

const locales: Locale[] = Object.values(LOCALES);
acceptLanguage.languages(locales);

const localeCookieSettings = {
  name: "locale",
  cookieSettings: {
    path: "/",
    httpOnly: true,
    expires: addYears(Date.now(), 1),
  },
};

export const localeProxy = (request: NextRequest) => {
  let locale;
  if (request.cookies.has("locale")) {
    locale = acceptLanguage.get(request.cookies.get("locale")?.value);
  }

  const currentPathLocale = locales.find((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}`),
  );
  if (currentPathLocale) {
    locale = currentPathLocale;
  }

  if (!locale) {
    locale = acceptLanguage.get(request.headers.get("accept-language") || initOptions.fallbackLng);
  }

  if (!locales.some((locale) => request.nextUrl.pathname.startsWith(`/${locale}`))) {
    const url = new URL(`/${locale}${request.nextUrl.pathname}`, request.url);

    const response = NextResponse.redirect(url);
    if (locale) {
      response.cookies.set("locale", locale, localeCookieSettings);
    }

    return response;
  }

  const response = NextResponse.next();
  if (locale) {
    response.cookies.set("locale", locale, localeCookieSettings);
  }

  return response;
};
