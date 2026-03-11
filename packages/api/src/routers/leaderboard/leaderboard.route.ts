import { TRPCError } from "@trpc/server";

import {
  leaderboardGetPositionInputSchema,
  leaderboardGetPositionOutputSchema,
  leaderboardListInputSchema,
  leaderboardListOutputSchema,
} from "@repo/validators";

import { protectedProcedure, router } from "../../server/trpc";

export const leaderboard = router({
  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/leaderboard.list", tags: ["Leaderboard"] } })
    .input(leaderboardListInputSchema)
    .output(leaderboardListOutputSchema)
    .query(async ({ input, ctx }) => {
      const entries = await ctx.prisma.customerProfile.findMany({
        take: input.limit,
        skip: input.cursor ? 1 : 0,
        orderBy: { totalPoints: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        select: {
          id: true,
          totalPoints: true,
          profile: {
            select: { nickname: true },
          },
        },
      });

      return entries.map((entry, index) => ({
        customerProfileId: entry.id,
        nickname: entry.profile.nickname,
        points: entry.totalPoints,
        position: index + 1,
      }));
    }),

  getPosition: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/leaderboard.getPosition", tags: ["Leaderboard"] },
    })
    .input(leaderboardGetPositionInputSchema)
    .output(leaderboardGetPositionOutputSchema)
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname, deletedAt: null },
        select: {
          nickname: true,
          customerProfile: {
            select: { id: true, totalPoints: true },
          },
        },
      });

      if (!profile?.customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const higherCount = await ctx.prisma.customerProfile.count({
        where: { totalPoints: { gt: profile.customerProfile.totalPoints } },
      });

      return {
        customerProfileId: profile.customerProfile.id,
        nickname: profile.nickname,
        points: profile.customerProfile.totalPoints,
        position: higherCount + 1,
      };
    }),
});
