import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";

import {
  userMeOutputSchema,
  userListOutputSchema,
  userGetByIdOutputSchema,
  userGetByIdInputSchema,
  userCreateInputSchema,
  userCreateOutputSchema,
} from "@repo/validators";

import { protectedProcedure, publicProcedure, router, staffProcedure } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";

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
          message: API_PROCEDURE_ERRORS.USER_NOT_FOUND,
        });
      }

      return user;
    }),

  list: staffProcedure
    .meta({ openapi: { method: "GET", path: "/user.list", tags: ["Users"] } })
    .output(userListOutputSchema)
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
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
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
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
          message: API_PROCEDURE_ERRORS.USER_NOT_FOUND,
        });
      }

      return user;
    }),

  create: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user.create", tags: ["Users"] } })
    .input(userCreateInputSchema)
    .output(userCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (foundUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: API_PROCEDURE_ERRORS.USER_ALREADY_EXISTS,
        });
      }

      const user = await ctx.prisma.user.create({
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
