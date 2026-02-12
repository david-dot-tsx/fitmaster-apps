import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

import { AbstractHandler, type HandlerBag } from "@/lib/proxy/handlers/abstract-handler";
import { hasSessionTokensAction } from "@/actions/session.actions";
import { isPathPublic } from "@/lib/proxy/helpers";

export class AuthTokenHandler extends AbstractHandler {
  protected async process({
    request,
    redirectUrl,
    cookiesBag,
    headersBag,
  }: HandlerBag): Promise<HandlerBag> {
    const tokensStatus = await this.getTokensStatus();
    switch (tokensStatus) {
      case "VALID":
        return { request, redirectUrl, cookiesBag, headersBag };
      case "TOKEN_EXPIRED":
        return await this.handleTokenExpiration({ request, redirectUrl, cookiesBag, headersBag });
      default:
        return this.handleNoTokens({ request, redirectUrl, cookiesBag, headersBag });
    }
  }

  private async getTokensStatus() {
    const { hasToken, hasRefreshToken } = await hasSessionTokensAction();
    if (hasToken && hasRefreshToken) return "VALID";
    if (!hasToken && hasRefreshToken) return "TOKEN_EXPIRED";

    return "NO_TOKENS";
  }

  private async handleTokenExpiration({
    request,
    redirectUrl,
    cookiesBag,
    headersBag,
  }: HandlerBag): Promise<HandlerBag> {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: "POST",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        headersBag["set-cookie"] = response.headers.get("set-cookie") ?? undefined;

        return { request, redirectUrl, cookiesBag, headersBag };
      }
      throw new Error("Failed to refresh tokens");
    } catch (_error) {
      redirectUrl = new URL("/auth/login", request.nextUrl);
      cookiesBag.push({
        name: AUTH_COOKIES_NAMES.TOKEN,
        value: undefined,
      });
      cookiesBag.push({
        name: AUTH_COOKIES_NAMES.REFRESH_TOKEN,
        value: undefined,
      });

      return { request, redirectUrl, cookiesBag, headersBag };
    }
  }

  private async handleNoTokens({
    request,
    redirectUrl,
    cookiesBag,
    headersBag,
  }: HandlerBag): Promise<HandlerBag> {
    if (isPathPublic(request.nextUrl.pathname)) {
      return { request, redirectUrl, cookiesBag, headersBag };
    } else {
      return { request, redirectUrl: new URL("/auth/login", request.url), cookiesBag, headersBag };
    }
  }
}
