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
  TrainingStatus,
} from "@repo/validators";

import { protectedProcedure, router, staffProcedure } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";
import { trainingSession } from "./session/training-session.route";
import { getBaseTrainingSessionStats } from "./session/training-session-base-stats";

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
    .meta({ openapi: { method: "POST", path: "/training.update", tags: ["Training"] } })
    .input(trainingUpdateInputSchema)
    .output(trainingUpdateOutputSchema)
    .mutation(async ({ input: { id, data }, ctx }) => {
      const training = await ctx.prisma.training.update({ where: { id }, data });

      return training;
    }),
  updateStatus: staffProcedure
    .meta({ openapi: { method: "POST", path: "/training.updateStatus", tags: ["Training"] } })
    .input(trainingUpdateStatusInputSchema)
    .output(trainingUpdateStatusOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const training = await ctx.prisma.training.findUnique({
        where: { id: input.trainingId },
        include: { trainingDays: true },
      });

      if (!training) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: API_PROCEDURE_ERRORS.NOT_FOUND,
        });
      }

      if (input.status === TrainingStatus.PUBLISHED && training?.trainingDays.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: API_PROCEDURE_ERRORS.PUBLISHED_TRAINING_WITHOUT_DAYS,
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
    .meta({ openapi: { method: "POST", path: "/training.delete", tags: ["Training"] } })
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

  /**
   * TODO: To refactor. This will work slowly for large datasets. Optimization needed.
   * First popped in head solution:
   *  -Remove stats from there.
   *  -Add another endpoint for stats,
   *  -Wrap training card component to load stats separately.
   */
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
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: { trainingDays: true },
          },
          trainingSessions: {
            where: {
              customerProfile: {
                profile: {
                  userId: ctx.sessionUser.id,
                },
              },
            },
            take: 1,
            include: {
              _count: {
                select: {
                  trainingDaySessions: true,
                },
              },
            },
          },
        },
      });

      const response = await Promise.all(
        trainings.map(async ({ _count, trainingSessions, ...training }) => {
          const totalDays = _count.trainingDays;
          const rawSession = trainingSessions[0];

          if (!rawSession) {
            return {
              ...training,
              totalDays,
              trainingSessions: [],
            };
          }

          const { _count: _stripSessionCount, ...sessionRest } = rawSession;
          const stats = await getBaseTrainingSessionStats(ctx.prisma, {
            trainingSessionId: rawSession.id,
            totalDays,
          });

          return {
            ...training,
            totalDays,
            trainingSessions: [{ ...sessionRest, stats }],
          };
        }),
      );

      return response;
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
          trainingSessions: {
            where: {
              customerProfile: {
                profile: {
                  userId: ctx.sessionUser.id,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
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

      const totalDays = training.trainingDays.length;
      const enrichedSessions = await Promise.all(
        training.trainingSessions.map(async (session) => ({
          ...session,
          stats: await getBaseTrainingSessionStats(ctx.prisma, {
            trainingSessionId: session.id,
            totalDays,
          }),
        })),
      );

      return trainingGetByIdCustomerOutputSchema.parse({
        ...training,
        trainingSessions: enrichedSessions,
        daysAmount: totalDays,
        exercises: uniqueBy(exercises, (exercise) => exercise.id),
      });
    }),
  session: trainingSession,
});
