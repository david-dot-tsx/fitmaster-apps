import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

import { trpcServerClient } from "@/lib/trpc/client-server";
import { AuthCookieBuilder } from "@/lib/auth-cookie-builder";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES_NAMES.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const data = await trpcServerClient.auth.refreshToken.mutate({
      refreshToken,
    });

    const response = NextResponse.json({ success: true });

    if (data && data.token && data.refreshToken) {
      const { name, value, cookieSettings } = AuthCookieBuilder.getAuthTokenCookieSettings(
        data.token,
      );
      response.cookies.set(name, value, cookieSettings);

      const {
        name: refreshTokenName,
        value: refreshTokenValue,
        cookieSettings: refreshTokenCookieSettings,
      } = AuthCookieBuilder.getAuthRefreshTokenCookieSettings(data.refreshToken);
      response.cookies.set(refreshTokenName, refreshTokenValue, refreshTokenCookieSettings);

      return response;
    }

    throw new Error("Invalid tokens received");
  } catch (_error) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
}
