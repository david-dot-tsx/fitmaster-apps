import { TRPCError } from "@trpc/server";

import {
  exerciseGetByIdInputSchema,
  exerciseGetByIdOutputSchema,
  exerciseCreateInputSchema,
  exerciseCreateOutputSchema,
  exerciseUpdateInputSchema,
  exerciseUpdateOutputSchema,
  exerciseDeleteInputSchema,
  exerciseDeleteOutputSchema,
  exerciseListOutputSchema,
} from "@repo/validators";

import { protectedProcedure, router, staffProcedure } from "../../server/trpc";

export const exercise = router({
  create: staffProcedure
    .meta({ openapi: { method: "POST", path: "/exercise.create", tags: ["Exercise"] } })
    .input(exerciseCreateInputSchema)
    .output(exerciseCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const exercise = await ctx.prisma.exercise.create({ data: input });

      return exercise;
    }),

  update: staffProcedure
    .meta({ openapi: { method: "POST", path: "/exercise.update", tags: ["Exercise"] } })
    .input(exerciseUpdateInputSchema)
    .output(exerciseUpdateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const exercise = await ctx.prisma.exercise.update({ where: { id: input.id }, data: input });

      return exercise;
    }),

  delete: staffProcedure
    .meta({ openapi: { method: "POST", path: "/exercise.delete", tags: ["Exercise"] } })
    .input(exerciseDeleteInputSchema)
    .output(exerciseDeleteOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const exercise = await ctx.prisma.exercise.delete({ where: { id: input.id } });

      return { id: exercise.id };
    }),

  getById: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/exercise.getById/{id}", tags: ["Exercise"] } })
    .input(exerciseGetByIdInputSchema)
    .output(exerciseGetByIdOutputSchema)
    .query(async ({ input, ctx }) => {
      const exercise = await ctx.prisma.exercise.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          difficulty: true,
          bodyPart: true,
          description: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!exercise) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return exercise;
    }),

  list: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/exercise.list", tags: ["Exercise"] } })
    .output(exerciseListOutputSchema)
    .query(async ({ ctx }) => {
      const exercises = await ctx.prisma.exercise.findMany({
        orderBy: { createdAt: "desc" },
      });

      return exercises;
    }),
});
