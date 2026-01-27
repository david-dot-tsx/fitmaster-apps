import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "@repo/db";
import {
  sessionUserSchema,
  type SessionUser,
  type SignToken,
  type TRPCContext,
} from "@repo/api/server";

import { env } from "@/env";

const getFirstHeader = (header: string | string[] | undefined): string | undefined => {
  if (!header) return undefined;

  return Array.isArray(header) ? header[0] : header;
};

export const createTrpcFastifyContext = async ({ req, res }: CreateFastifyContextOptions) => {
  let sessionUser: SessionUser | null = null;

  try {
    await req.jwtVerify();

    const result = sessionUserSchema.safeParse(req.user);
    sessionUser = result.success ? result.data : null;
  } catch (_error) {
    sessionUser = null;
  }
  const signToken: SignToken = (payload: SessionUser) =>
    res.jwtSign(payload, { expiresIn: env.JWT_TOKEN_EXPIRES_IN });

  const ctx: TRPCContext = {
    prisma,
    sessionUser,
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
    },
    config: {
      refreshTokenExpiresInDays: env.JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS,
    },
  };

  return ctx;
};

export type Context = Awaited<ReturnType<typeof createTrpcFastifyContext>>;
