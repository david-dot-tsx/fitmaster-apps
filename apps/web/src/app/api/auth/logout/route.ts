import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

import { trpcServerClient } from "@/lib/trpc/client-server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES_NAMES.REFRESH_TOKEN)?.value;

  try {
    if (refreshToken) {
      await trpcServerClient.auth.logout.mutate({ refreshToken });
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
  }

  const response = NextResponse.json({ success: true });

  response.cookies.delete(AUTH_COOKIES_NAMES.TOKEN);
  response.cookies.delete(AUTH_COOKIES_NAMES.REFRESH_TOKEN);

  return response;
}
