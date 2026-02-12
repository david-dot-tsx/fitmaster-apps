import { type NextRequest } from "next/server";

import { ProxyChainBuilder } from "@/lib/proxy/proxy-chain-builder";
import { AuthTokenHandler } from "@/lib/proxy/handlers/auth-token-handler";
import { LocaleHandler } from "@/lib/proxy/handlers/locale-handler";

export async function proxy(request: NextRequest) {
  const response = await new ProxyChainBuilder()
    .add(new AuthTokenHandler())
    .add(new LocaleHandler())
    .run({ request });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|installHook\\.js|\\.map$).*)",
  ],
};
