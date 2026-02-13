import { TRPCError } from "@trpc/server";

import {
  trainingCreateInputSchema,
  trainingCreateOutputSchema,
  trainingDeleteInputSchema,
  trainingDeleteOutputSchema,
  trainingGetByIdInputSchema,
  trainingGetByIdOutputSchema,
  trainingListStaffInputSchema,
  trainingListStaffOutputSchema,
  trainingUpdateInputSchema,
  trainingUpdateOutputSchema,
} from "@repo/validators";

import { router, staffProcedure } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";

export const training = router({
  create: staffProcedure
    .meta({ openapi: { method: "POST", path: "/training.create", tags: ["Training"] } })
    .input(trainingCreateInputSchema)
    .output(trainingCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.create({ data: input });

      return training;
    }),
  update: staffProcedure
    .meta({ openapi: { method: "PUT", path: "/training.update", tags: ["Training"] } })
    .input(trainingUpdateInputSchema)
    .output(trainingUpdateOutputSchema)
    .mutation(async ({ input: { id, data }, ctx }) => {
      const training = await ctx.prisma.training.update({ where: { id }, data });

      return training;
    }),

  delete: staffProcedure
    .meta({ openapi: { method: "DELETE", path: "/training.delete", tags: ["Training"] } })
    .input(trainingDeleteInputSchema)
    .output(trainingDeleteOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.delete({ where: { id: input.id } });

      return { id: training.id };
    }),

  getById: staffProcedure
    .meta({ openapi: { method: "GET", path: "/training.getById/{id}", tags: ["Training"] } })
    .input(trainingGetByIdInputSchema)
    .output(trainingGetByIdOutputSchema)
    .query(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.findUnique({ where: { id: input.id } });

      if (!training) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: API_PROCEDURE_ERRORS.NOT_FOUND,
        });
      }

      return training;
    }),

  listStaff: staffProcedure
    .meta({ openapi: { method: "GET", path: "/training.listStaff", tags: ["Training"] } })
    .input(trainingListStaffInputSchema)
    .output(trainingListStaffOutputSchema)
    .query(async ({ input, ctx }) => {
      const trainings = await ctx.prisma.training.findMany({
        where: { status: { in: input.status } },
      });

      return trainings;
    }),
});
