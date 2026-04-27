import { AUTH_COOKIES_NAMES, AuthCookieBuilder as BaseAuthCookieBuilder } from "@repo/api/cookies";

import { env } from "@/env";

export class AuthCookieBuilder {
  private static instance: AuthCookieBuilder;
  private cookieBuilder: BaseAuthCookieBuilder;

  private constructor() {
    this.cookieBuilder = new BaseAuthCookieBuilder({
      refreshTokenMaxAgeInSeconds: env.COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS,
      tokenMaxAgeInSeconds: env.COOKIE_TOKEN_MAX_AGE_IN_SECONDS,
      secure: env.NODE_ENV !== "local",
    });
  }

  private static getInstance() {
    if (!AuthCookieBuilder.instance) {
      AuthCookieBuilder.instance = new AuthCookieBuilder();
    }

    return AuthCookieBuilder.instance;
  }
  public static getAuthTokenCookieSettings(value: string) {
    return this.getInstance().cookieBuilder.getAuthCookieSettings({
      name: AUTH_COOKIES_NAMES.TOKEN,
      value,
    });
  }

  public static getAuthRefreshTokenCookieSettings(value: string) {
    return this.getInstance().cookieBuilder.getAuthCookieSettings({
      name: AUTH_COOKIES_NAMES.REFRESH_TOKEN,
      value,
    });
  }
}
