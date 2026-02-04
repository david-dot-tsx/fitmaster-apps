import { NextResponse } from "next/server";

import { trpcServerClient } from "@/lib/trpc/client-server";
import { AuthCookieBuilder } from "@/lib/auth-cookie-builder";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { email, password } = body;
    const data = await trpcServerClient.auth.login.mutate({ email, password });

    const response = NextResponse.json({ success: true });

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
  } catch (_error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
