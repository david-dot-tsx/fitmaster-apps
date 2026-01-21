import { z } from "zod";

import { publicProcedure, router } from "@/trpc";

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    return users;
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          role: true,
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
        role: z.enum(["ADMIN", "TRAINER", "CUSTOMER"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          role: input.role,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      return user;
    }),
});
