"use server";
import { cookies } from "next/headers";

import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

export async function hasSessionTokensAction(): Promise<{
  hasToken: boolean;
  hasRefreshToken: boolean;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES_NAMES.TOKEN)?.value;
  const refreshToken = cookieStore.get(AUTH_COOKIES_NAMES.REFRESH_TOKEN)?.value;

  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
  };
}
