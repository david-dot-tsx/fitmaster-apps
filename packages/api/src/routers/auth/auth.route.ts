import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import { addSeconds } from "date-fns";

import { prisma } from "@repo/db";
import {
  authLoginInputSchema,
  authLoginOutputSchema,
  authLogoutInputSchema,
  authLogoutOutputSchema,
  authRefreshTokenInputSchema,
  authRefreshTokenOutputSchema,
} from "@repo/validators";

import { generateRefreshToken, hashRefreshToken } from "../../server/utils/refresh-token";
import { router, publicProcedure } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";

/**
 * TODO:
 * - Create a router builder to avoid code duplication, and for specific procedures
 */
export const auth = router({
  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth.login", tags: ["Auth"] } })
    .input(authLoginInputSchema)
    .output(authLoginOutputSchema)
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
            expiresAt: addSeconds(new Date(), ctx.config.refreshTokenExpiresInSeconds),
          },
        });
        const token = await ctx.utils.signToken({
          id: foundUser.id,
          role: foundUser.role,
          email: foundUser.email,
        });
        ctx.utils.setAuthToken(token);
        ctx.utils.setAuthRefreshToken(refreshToken);

        return { token, refreshToken };
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: API_PROCEDURE_ERRORS.INVALID_CREDENTIALS,
      });
    }),

  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth.logout", tags: ["Auth"] } })
    .input(authLogoutInputSchema)
    .output(authLogoutOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const hashedToken = hashRefreshToken(input.refreshToken);
      try {
        await ctx.prisma.session.delete({
          where: {
            refreshToken: hashedToken,
          },
        });
        ctx.utils.clearAuth();
      } catch (_error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: API_PROCEDURE_ERRORS.FAILED_TO_LOGOUT,
        });
      }
    }),
  refreshToken: publicProcedure
    .meta({ openapi: { method: "POST", path: "/auth.refreshToken", tags: ["Auth"] } })
    .input(authRefreshTokenInputSchema)
    .output(authRefreshTokenOutputSchema)
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
      // Session expired or invalid
      if (!session || session.expiresAt < new Date()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: API_PROCEDURE_ERRORS.SESSION_EXPIRED_OR_INVALID,
        });
      }

      // Different user agent
      if (session.userAgent !== ctx.client.userAgent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: API_PROCEDURE_ERRORS.SESSION_INVALID,
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
            expiresAt: addSeconds(new Date(), ctx.config.refreshTokenExpiresInSeconds),
          },
        }),
      ]);

      const token = await ctx.utils.signToken({
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
      });
      ctx.utils.setAuthToken(token);
      ctx.utils.setAuthRefreshToken(newRawRefreshToken);

      return {
        token,
        refreshToken: newRawRefreshToken,
      };
    }),
});
