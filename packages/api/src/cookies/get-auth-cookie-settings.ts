import { AUTH_COOKIES_NAMES, type AuthCookieNamesValues } from "./const";

export class AuthCookieBuilder {
  private refreshTokenMaxAgeInSeconds: number;
  private tokenMaxAgeInSeconds: number;
  private secure: boolean;

  constructor({
    refreshTokenMaxAgeInSeconds,
    tokenMaxAgeInSeconds,
    secure,
  }: {
    refreshTokenMaxAgeInSeconds: number;
    tokenMaxAgeInSeconds: number;
    secure: boolean;
  }) {
    this.refreshTokenMaxAgeInSeconds = refreshTokenMaxAgeInSeconds;
    this.tokenMaxAgeInSeconds = tokenMaxAgeInSeconds;
    this.secure = secure;
  }

  public getAuthCookieSettings({
    name,
    value,
    sameSite = "lax",
  }: {
    name: AuthCookieNamesValues;
    value: string;
    sameSite?: "lax" | "strict" | "none";
  }) {
    const cookieSettings = {
      httpOnly: true,
      secure: this.secure,
      sameSite,
      path: "/",
      maxAge:
        name === AUTH_COOKIES_NAMES.TOKEN
          ? this.tokenMaxAgeInSeconds
          : this.refreshTokenMaxAgeInSeconds,
    };

    return { name, value, cookieSettings };
  }
}
