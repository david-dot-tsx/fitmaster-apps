import { initTRPC } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { prisma } from "@repo/db";

/**
 * Create tRPC context
 */
export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  return {
    req,
    res,
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
