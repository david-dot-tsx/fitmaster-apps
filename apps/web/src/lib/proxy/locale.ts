import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import acceptLanguage from "accept-language";

import { initOptions, LOCALES, type Locale } from "@repo/i18n/web";

const locales: Locale[] = Object.values(LOCALES);
acceptLanguage.languages(locales);

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
      response.cookies.set("locale", locale, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return response;
  }

  const response = NextResponse.next();
  if (locale) {
    response.cookies.set("locale", locale, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return response;
};
