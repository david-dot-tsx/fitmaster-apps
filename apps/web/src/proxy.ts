import { type NextRequest } from "next/server";

import { localeProxy } from "@/lib/proxy/locale";

export async function proxy(request: NextRequest) {
  return localeProxy(request);

  /**
   * TODO: to refactor proxy to handle router with lang settings
   */

  // const pathname = request.nextUrl.pathname;

  // const publicPaths = ["/{locale}", "/auth/login/{locale}", "/auth/register/{locale}"];

  // if (publicPaths.some((p) => pathname === p)) {
  //   return NextResponse.next();
  // }
  // const { hasToken, hasRefreshToken } = await hasSessionTokensAction();

  // console.log("PROXY HAS SESSION TOKENS COOKIES:", { hasToken, hasRefreshToken });

  // if (!hasToken && !hasRefreshToken) {
  //   return NextResponse.redirect(new URL("/en/auth/login", request.url));
  // }

  // if (!hasToken && hasRefreshToken) {
  //   try {
  //     const response = await fetch("/api/auth/refresh", { method: "POST" });

  //     if (response.ok) {
  //       return NextResponse.next();
  //     }
  //   } catch (_error) {
  //     const loginUrl = new URL("/en/auth/login", request.url);
  //     const response = NextResponse.redirect(loginUrl);
  //     response.cookies.delete(AUTH_COOKIES_NAMES.TOKEN);
  //     response.cookies.delete(AUTH_COOKIES_NAMES.REFRESH_TOKEN);

  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  // return NextResponse.next();
}

// export const config = {
//   matcher: [
//     /*
//      * Matches all paths except:
//      * - api (Route Handlers)
//      * - _next/static (static files)
//      * - _next/image (optimized images)
//      * - favicon.ico
//      */
//     "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)", // TUTORIAL
//   ],
// };

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|installHook\\.js(\\.map)?|\\.map$).*)",
//   ],
// };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|installHook\\.js|\\.map$).*)",
  ],
};
