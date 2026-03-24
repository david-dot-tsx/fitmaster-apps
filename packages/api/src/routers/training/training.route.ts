import { TRPCError } from "@trpc/server";
import { uniqueBy } from "remeda";

import {
  canChangeStatus,
  trainingCreateInputSchema,
  trainingCreateOutputSchema,
  trainingDeleteInputSchema,
  trainingDeleteOutputSchema,
  trainingGetByIdInputSchema,
  trainingGetByIdOutputSchema,
  trainingGetByIdCustomerInputSchema,
  trainingGetByIdCustomerOutputSchema,
  trainingListPublishedInputSchema,
  trainingListPublishedOutputSchema,
  trainingListStaffInputSchema,
  trainingListStaffOutputSchema,
  trainingUpdateInputSchema,
  trainingUpdateOutputSchema,
  trainingUpdateStatusInputSchema,
  trainingUpdateStatusOutputSchema,
} from "@repo/validators";

import { protectedProcedure, router, staffProcedure } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";
import { trainingSession } from "./enrolment/training-session.route";

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
  updateStatus: staffProcedure
    .meta({ openapi: { method: "PATCH", path: "/training.updateStatus", tags: ["Training"] } })
    .input(trainingUpdateStatusInputSchema)
    .output(trainingUpdateStatusOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.findUnique({ where: { id: input.trainingId } });
      if (!training) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: API_PROCEDURE_ERRORS.NOT_FOUND,
        });
      }

      if (!canChangeStatus(training.status, input.status, ctx.sessionUser.role)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: API_PROCEDURE_ERRORS.FORBIDDEN,
        });
      }

      const updatedTraining = await ctx.prisma.training.update({
        where: { id: input.trainingId },
        data: { status: input.status },
      });

      return updatedTraining;
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

  listPublished: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/training.listPublished", tags: ["Training"] } })
    .input(trainingListPublishedInputSchema)
    .output(trainingListPublishedOutputSchema)
    .query(async ({ input, ctx }) => {
      const trainings = await ctx.prisma.training.findMany({
        take: input.limit,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      });

      return trainings;
    }),

  getByIdCustomer: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/training.getByIdCustomer/{id}", tags: ["Training"] },
    })
    .input(trainingGetByIdCustomerInputSchema)
    .output(trainingGetByIdCustomerOutputSchema)
    .query(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.findUnique({
        where: { id: input.id, status: "PUBLISHED" },
        include: {
          trainingDays: {
            include: {
              workoutExercises: {
                include: { exercise: true },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      if (!training) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: API_PROCEDURE_ERRORS.NOT_FOUND,
        });
      }

      const exercises = training.trainingDays.flatMap((day) =>
        day.workoutExercises.map((exercise) => exercise.exercise),
      );

      return {
        ...training,
        daysAmount: training.trainingDays.length,
        exercises: uniqueBy(exercises, (exercise) => exercise.id),
      };
    }),
  session: trainingSession,
});
