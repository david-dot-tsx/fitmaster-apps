import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";

import { prisma } from "@repo/db";

import { protectedProcedure, publicProcedure, router, staffProcedure } from "../../server/trpc";
import {
  userMeOutputSchema,
  userListOutputSchema,
  userGetByIdOutputSchema,
  userGetByIdInputSchema,
  userCreateInputSchema,
  userCreateOutputSchema,
} from "./user.schema";

export const user = router({
  me: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/user.me", tags: ["Users"] } })
    .output(userMeOutputSchema)
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.sessionUser.id },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              nickname: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  list: staffProcedure
    .meta({ openapi: { method: "GET", path: "/user.list", tags: ["Users"] } })
    .output(userListOutputSchema)
    .query(async () => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return users;
    }),

  getById: staffProcedure
    .meta({ openapi: { method: "GET", path: "/user.getById/{id}", tags: ["Users"] } })
    .input(userGetByIdInputSchema)
    .output(userGetByIdOutputSchema)
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  create: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user.create", tags: ["Users"] } })
    .input(userCreateInputSchema)
    .output(userCreateOutputSchema)
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash: await argon2.hash(input.password),
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    }),
});
