import { type NextRequest } from "next/server";

import { localeProxy } from "@/lib/proxy/locale";

export async function proxy(request: NextRequest) {
  return localeProxy(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|installHook\\.js|\\.map$).*)",
  ],
};
