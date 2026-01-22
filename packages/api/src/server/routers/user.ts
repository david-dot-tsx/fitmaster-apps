import { z } from "zod";

import { prisma } from "@repo/db";

import { publicProcedure, router } from "../trpc";

export const user = router({
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
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
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
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
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
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
