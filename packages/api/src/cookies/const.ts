export const AUTH_COOKIES_NAMES = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
} as const;
export type AuthCookieNamesValues = (typeof AUTH_COOKIES_NAMES)[keyof typeof AUTH_COOKIES_NAMES];
