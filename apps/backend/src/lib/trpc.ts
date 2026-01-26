import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "@repo/db";
import { type SessionUser, type SignToken } from "@repo/api/server";

export const createTrpcFastifyContext = async ({ req, res }: CreateFastifyContextOptions) => {
  let user;
  try {
    await req.jwtVerify();
    user = req.user;
  } catch (_error) {
    user = null;
  }
  const signToken: SignToken = (payload: SessionUser) => res.jwtSign(payload);

  const ctx = {
    req,
    res,
    prisma,
    user,
    signToken,
  };

  return ctx;
};

export type Context = Awaited<ReturnType<typeof createTrpcFastifyContext>>;
