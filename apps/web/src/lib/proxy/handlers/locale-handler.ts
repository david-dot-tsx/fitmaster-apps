import { type NextRequest } from "next/server";
import { addYears } from "date-fns";

import { AbstractHandler, type HandlerBag } from "@/lib/proxy/handlers/abstract-handler";
import {
  getAcceptLanguageHeaderLocale,
  getCookieLocale,
  getCurrentPathLocale,
  getFallbackLocale,
  getUrlWithLocale,
  isLocalizedPath,
} from "@/lib/proxy/helpers";
import { COOKIES_NAMES } from "@/consts/cookies";

export class LocaleHandler extends AbstractHandler {
  protected async process({
    request,
    redirectUrl,
    cookiesBag,
    headersBag,
  }: HandlerBag): Promise<HandlerBag> {
    let localeUrl: URL | null = null;

    let locale: string;
    const cookieLocale = getCookieLocale(request);
    const currentPathLocale = getCurrentPathLocale(request);
    const acceptLanguageHeaderLocale = getAcceptLanguageHeaderLocale(request);
    const fallbackLocale = getFallbackLocale();

    if (currentPathLocale) {
      locale = currentPathLocale;
    } else if (cookieLocale) {
      locale = cookieLocale;
    } else if (acceptLanguageHeaderLocale) {
      locale = acceptLanguageHeaderLocale;
    } else {
      locale = fallbackLocale;
    }

    if (locale !== currentPathLocale) {
      localeUrl = this.prepareLocalizedRedirectUrl(request, redirectUrl, locale);
      cookiesBag.push({
        name: COOKIES_NAMES.LOCALE,
        value: locale,
        cookieSettings: {
          path: "/",
          expires: addYears(Date.now(), 1),
        },
      });
    }

    if (redirectUrl && !isLocalizedPath(redirectUrl.pathname)) {
      redirectUrl = getUrlWithLocale(redirectUrl.pathname, request, locale);
    }

    return { request, redirectUrl: localeUrl || redirectUrl, cookiesBag, headersBag };
  }

  private prepareLocalizedRedirectUrl(
    request: NextRequest,
    redirectUrl: URL | null,
    locale: string,
  ) {
    if (!redirectUrl) {
      return getUrlWithLocale(request.nextUrl.pathname, request, locale);
    }
    if (isLocalizedPath(redirectUrl.pathname)) {
      return redirectUrl;
    } else {
      return getUrlWithLocale(redirectUrl.pathname, request, locale);
    }
  }
}
