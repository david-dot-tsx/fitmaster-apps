import { z } from "zod";

import { publicProcedure, router } from "@/trpc.js";

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return users;
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return user;
    }),
});
