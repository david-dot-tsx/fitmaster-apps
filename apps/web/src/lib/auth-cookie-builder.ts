import "server-only";
import { AUTH_COOKIES_NAMES, AuthCookieBuilder as BaseAuthCookieBuilder } from "@repo/api/cookies";

import { env } from "@/env";

export class AuthCookieBuilder {
  private static instance: AuthCookieBuilder;
  private cookieBuilder: BaseAuthCookieBuilder;

  private constructor() {
    // When running over plain HTTP (local/dev/test), Safari is strict about `Secure` cookies.
    // Using `SameSite=Lax` in that case keeps session cookies working for same-site navigations.
    const secure = env.NODE_ENV === "production";

    this.cookieBuilder = new BaseAuthCookieBuilder({
      refreshTokenMaxAgeInSeconds: env.COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS,
      tokenMaxAgeInSeconds: env.COOKIE_TOKEN_MAX_AGE_IN_SECONDS,
      secure,
    });
  }

  private static getInstance() {
    if (!AuthCookieBuilder.instance) {
      AuthCookieBuilder.instance = new AuthCookieBuilder();
    }

    return AuthCookieBuilder.instance;
  }
  public static getAuthTokenCookieSettings(value: string) {
    const secure = env.NODE_ENV === "production";
    const sameSite: "lax" | "none" = secure ? "none" : "lax";

    return this.getInstance().cookieBuilder.getAuthCookieSettings({
      name: AUTH_COOKIES_NAMES.TOKEN,
      value,
      sameSite,
    });
  }

  public static getAuthRefreshTokenCookieSettings(value: string) {
    const secure = env.NODE_ENV === "production";
    const sameSite: "lax" | "none" = secure ? "none" : "lax";

    return this.getInstance().cookieBuilder.getAuthCookieSettings({
      name: AUTH_COOKIES_NAMES.REFRESH_TOKEN,
      value,
      sameSite,
    });
  }
}
