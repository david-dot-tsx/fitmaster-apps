import { initTRPC, TRPCError } from "@trpc/server";
import { type OpenApiMeta } from "trpc-to-openapi";

import { type PrismaClient, type Role as RoleType, Role } from "@repo/db";

import type { SessionUser, SignToken } from "./types";

export interface TRPCContext {
  prisma: PrismaClient;
  res: unknown;
  req: unknown;
  user: SessionUser | null;
  signToken: SignToken;
}
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TRPCContext>().meta<OpenApiMeta>().create();

/**
 * isAuthed middleware to check if the user is authenticated
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to access this resource.",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

const isAdmin = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({ ctx });
});

const isTrainer = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (ctx.user.role !== "TRAINER") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({ ctx });
});

const isCustomer = isAuthed.unstable_pipe(({ next, ctx }) => {
  if (ctx.user.role !== "CUSTOMER") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({ ctx });
});

const hasRole = (roles: RoleType[]) =>
  isAuthed.unstable_pipe(({ next, ctx }) => {
    if (!roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  });

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
export const trainerProcedure = t.procedure.use(isTrainer);
export const customerProcedure = t.procedure.use(isCustomer);
export const staffProcedure = t.procedure.use(hasRole([Role.ADMIN, Role.TRAINER]));
