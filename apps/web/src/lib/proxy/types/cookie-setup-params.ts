export interface CookieSetupParams {
  name: string;
  value: string | undefined;
  cookieSettings?: {
    path: string;
    httpOnly?: boolean;
    expires: Date;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
    maxAge?: number;
  };
}
