import { type NextRequest, NextResponse } from "next/server";

import { LOCALES } from "@repo/i18n/web";

import { hasSessionTokensAction } from "@/actions/session.actions";

const publicPaths = ["/", "/{locale}", "/{locale}/auth/login", "/{locale}/auth/register"] as const;

const locales = Object.values(LOCALES);

const getPublicPaths = (locale?: string) => {
  return publicPaths.map((path) => path.replace("/{locale}", locale ? `/${locale}` : "/"));
};

export const sessionProxy = async (request: NextRequest) => {
  const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  const currentLocale = locales.find((locale) => request.nextUrl.pathname.startsWith(`/${locale}`));

  const publicPaths = getPublicPaths(currentLocale);

  if (publicPaths.some((publicPath) => request.nextUrl.pathname.startsWith(publicPath))) {
    return NextResponse.next();
  }

  if (!hasToken && !hasRefreshToken) {
    return NextResponse.redirect(new URL(`/${currentLocale}/auth/login`, request.url));
  }

  return NextResponse.next();
};
