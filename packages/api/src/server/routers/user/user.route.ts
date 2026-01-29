import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import { addDays } from "date-fns";

import { prisma } from "@repo/db";

import { protectedProcedure, publicProcedure, router, staffProcedure } from "../../trpc";
import {
  userLoginInputSchema,
  userLoginOutputSchema,
  userMeOutputSchema,
  userListOutputSchema,
  userGetByIdOutputSchema,
  userGetByIdInputSchema,
  userCreateInputSchema,
  userCreateOutputSchema,
  userRefreshTokenInputSchema,
  userRefreshTokenOutputSchema,
  userLogoutInputSchema,
  userLogoutOutputSchema,
} from "./user.schema";
import { generateRefreshToken, hashRefreshToken } from "../../utils/refresh-token";

export const user = router({
  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user.login", tags: ["Users"] } })
    .input(userLoginInputSchema)
    .output(userLoginOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const foundUser = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          role: true,
        },
      });

      if (
        foundUser &&
        foundUser.passwordHash &&
        (await argon2.verify(foundUser.passwordHash, input.password))
      ) {
        const refreshToken = generateRefreshToken();
        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await ctx.prisma.session.create({
          data: {
            userId: foundUser.id,
            refreshToken: hashedRefreshToken,
            userAgent: ctx.client.userAgent,
            ip: ctx.client.ip,
            deviceInfo: ctx.client.deviceInfo,
            expiresAt: addDays(new Date(), ctx.config.refreshTokenExpiresInDays),
          },
        });

        const token = await ctx.utils.signToken({
          id: foundUser.id,
          role: foundUser.role,
          email: foundUser.email,
        });

        return { token, refreshToken };
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }),

  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user.logout", tags: ["Users"] } })
    .input(userLogoutInputSchema)
    .output(userLogoutOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const hashedToken = hashRefreshToken(input.refreshToken);

      try {
        await ctx.prisma.session.delete({
          where: {
            refreshToken: hashedToken,
          },
        });
      } catch (_error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to logout",
        });
      }
    }),
  refreshToken: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user.refreshToken", tags: ["Users"] } })
    .input(userRefreshTokenInputSchema)
    .output(userRefreshTokenOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const hashedInputToken = hashRefreshToken(input.refreshToken);

      const session = await ctx.prisma.session.findUnique({
        where: { refreshToken: hashedInputToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Session expired or invalid. Please login again.",
        });
      }

      if (session.userAgent !== ctx.client.userAgent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Session invalid. Please login again.",
        });
      }

      const newRawRefreshToken = generateRefreshToken();
      const newHashedRefreshToken = hashRefreshToken(newRawRefreshToken);

      await ctx.prisma.$transaction([
        ctx.prisma.session.delete({
          where: { id: session.id },
        }),
        ctx.prisma.session.create({
          data: {
            userId: session.user.id,
            refreshToken: newHashedRefreshToken,
            userAgent: ctx.client.userAgent,
            ip: ctx.client.ip,
            deviceInfo: ctx.client.deviceInfo,
            expiresAt: addDays(new Date(), ctx.config.refreshTokenExpiresInDays),
          },
        }),
      ]);

      const token = await ctx.utils.signToken({
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
      });

      return {
        token,
        refreshToken: newRawRefreshToken,
      };
    }),

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
