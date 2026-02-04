import { type NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

import { hasSessionTokensAction } from "@/actions/session.actions";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/", "/auth/login", "/auth/register"];

  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }
  const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  if (!hasToken && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!hasToken && hasRefreshToken) {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });

      if (response.ok) {
        return NextResponse.next();
      }
    } catch (_error) {
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(AUTH_COOKIES_NAMES.TOKEN);
      response.cookies.delete(AUTH_COOKIES_NAMES.REFRESH_TOKEN);

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matches all paths except:
     * - api (Route Handlers)
     * - _next/static (static files)
     * - _next/image (optimized images)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
