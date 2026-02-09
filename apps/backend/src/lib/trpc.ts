import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "@repo/db/prisma";
import {
  sessionUserSchema,
  type SessionUser,
  type SignToken,
  type TRPCContext,
} from "@repo/api/server";
import { API_HEADERS_KEYS } from "@repo/api/headers";
import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

import { env } from "@/env";
import { AuthCookieBuilder } from "@/lib/auth-cookie-builder";

const getFirstHeader = (header: string | string[] | undefined): string | undefined => {
  if (!header) return undefined;

  return Array.isArray(header) ? header[0] : header;
};

export const createTrpcFastifyContext = async ({ req, res }: CreateFastifyContextOptions) => {
  let sessionUser: SessionUser | null = null;

  const sessionDeviceType = getFirstHeader(req.headers[API_HEADERS_KEYS.X_CLIENT_TYPE]);

  const setAuthToken = (token: string) => {
    const { name, value, cookieSettings } = AuthCookieBuilder.getAuthTokenCookieSettings(token);
    res.setCookie(name, value, cookieSettings);
  };

  const setAuthRefreshToken = (refreshToken: string) => {
    const { name, value, cookieSettings } =
      AuthCookieBuilder.getAuthRefreshTokenCookieSettings(refreshToken);
    res.setCookie(name, value, cookieSettings);
  };

  const clearAuth = () => {
    res.clearCookie(AUTH_COOKIES_NAMES.TOKEN);
    res.clearCookie(AUTH_COOKIES_NAMES.REFRESH_TOKEN);
  };

  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = await req.server.jwt.verify(token);
      const result = sessionUserSchema.safeParse(decoded);
      if (result.success) {
        sessionUser = result.data;
      }
    } catch (_error) {
      sessionUser = null;
    }
  }

  const signToken: SignToken = (payload: SessionUser) =>
    res.jwtSign(payload, {
      expiresIn: env.JWT_TOKEN_EXPIRES_IN_SECONDS,
    });

  const ctx: TRPCContext = {
    prisma,
    sessionUser,
    sessionDeviceType,
    client: {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      deviceInfo: {
        name: getFirstHeader(req.headers["x-device-name"]),
        os: getFirstHeader(req.headers["x-device-os"]),
      },
    },
    utils: {
      signToken,
      clearAuth,
      setAuthToken,
      setAuthRefreshToken,
    },
    config: {
      refreshTokenExpiresInSeconds: env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    },
  };

  return ctx;
};

export type Context = Awaited<ReturnType<typeof createTrpcFastifyContext>>;
