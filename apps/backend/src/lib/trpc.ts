import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "@repo/db";

export const createTrpcFastifyContext = ({ req, res }: CreateFastifyContextOptions) => {
  return {
    req,
    res,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createTrpcFastifyContext>>;
