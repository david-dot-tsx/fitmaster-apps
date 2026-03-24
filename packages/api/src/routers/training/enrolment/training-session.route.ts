import { TRPCError } from "@trpc/server";
import { endOfDay, startOfDay } from "date-fns";

import {
  trainingSessionNewInputSchema,
  trainingSessionNewOutputSchema,
  trainingSessionMyTrainingsOutputSchema,
  trainingSessionStartDayInputSchema,
  trainingSessionStartDayOutputSchema,
  trainingSessionStartExerciseInputSchema,
  trainingSessionStartExerciseOutputSchema,
  trainingSessionCompleteExerciseInputSchema,
  trainingSessionCompleteExerciseOutputSchema,
  trainingSessionGetCurrentExerciseInputSchema,
  trainingSessionGetCurrentExerciseOutputSchema,
} from "@repo/validators";
import {
  TrainingDaySessionStatus,
  TrainingSessionStatus,
  WorkoutExerciseSessionStatus,
} from "@repo/db/types";

import { router, customerProcedure } from "../../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../../consts/api-procedure-errors";

export const trainingSession = router({
  new: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.session.new",
        tags: ["Training:Session"],
      },
    })
    .input(trainingSessionNewInputSchema)
    .output(trainingSessionNewOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: {
          profile: {
            userId: ctx.sessionUser.id,
          },
        },
      });

      if (!customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }
      const trainingSession = await ctx.prisma.trainingSession.create({
        data: {
          customerProfileId: customerProfile.id,
          trainingId: input.trainingId,
        },
      });

      return { id: trainingSession.id };
    }),

  myTrainings: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/training.session.myTrainings",
        tags: ["Training:Session"],
      },
    })
    .output(trainingSessionMyTrainingsOutputSchema)
    .query(async ({ ctx }) => {
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: {
          profile: {
            userId: ctx.sessionUser.id,
          },
        },
      });
      if (!customerProfile) {
        return [];
      }

      const trainingSessions = await ctx.prisma.trainingSession.findMany({
        where: {
          customerProfileId: customerProfile.id,
        },
        include: {
          training: true,
        },
      });

      return trainingSessionMyTrainingsOutputSchema.parse(trainingSessions);
    }),
  /**
   * Creates TrainingDaySession + all nested blocks & exercises in one transaction.
   * Idempotent: if the day was already started, returns the existing record.
   */
  startDay: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.session.startDay",
        tags: ["Training:Session"],
      },
    })
    .input(trainingSessionStartDayInputSchema)
    .output(trainingSessionStartDayOutputSchema)
    .mutation(async ({ input, ctx }) => {
      // 1. Verify enrolment belongs to authenticated customer
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: { profile: { userId: ctx.sessionUser.id } },
      });
      if (!customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      const trainingSession = await ctx.prisma.trainingSession.findFirst({
        where: {
          id: input.trainingSessionId,
          customerProfileId: customerProfile.id,
        },
        include: {
          trainingDaySessions: true,
          training: {
            include: {
              trainingDays: true,
            },
          },
        },
      });

      if (!trainingSession) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 2. Idempotency: return existing progress day if already started.
      // If today's day is already completed, return it instead of creating a new one.
      const now = new Date();
      const existingProgressDay = await ctx.prisma.trainingDaySession.findFirst({
        orderBy: [{ trainingDay: { order: "asc" } }],
        where: {
          trainingSessionId: input.trainingSessionId,
          OR: [
            {
              status: {
                in: [TrainingDaySessionStatus.IN_PROGRESS, TrainingDaySessionStatus.NOT_STARTED],
              },
            },
            {
              status: TrainingDaySessionStatus.COMPLETED,
              finishedAt: {
                gte: startOfDay(now),
                lte: endOfDay(now),
              },
            },
          ],
        },
        include: {
          workoutExerciseSessions: {
            orderBy: [
              { workoutExercise: { workoutBlockType: "asc" } },
              { workoutExercise: { order: "asc" } },
            ],
            include: {
              workoutExercise: {
                include: {
                  exercise: true,
                },
              },
            },
          },
          trainingDay: true,
        },
      });

      const stats = {
        todaysExercisesAmount: existingProgressDay?.workoutExerciseSessions.length ?? 0,
        currentDay: existingProgressDay?.trainingDay?.order ?? 1,
        totalDays: trainingSession.training?.trainingDays.length ?? 0,
      };

      if (existingProgressDay) {
        const response = {
          ...existingProgressDay,
          stats,
        };

        return trainingSessionStartDayOutputSchema.parse(response);
      }

      /**
       * 4. Load the training day template with all blocks and exercises
       *  - where the training day belongs to the training
       *  - where none of that
       *
       */
      const trainingDay = await ctx.prisma.trainingDay.findFirst({
        where: {
          trainingId: trainingSession.trainingId,
          trainingDaySessions: {
            none: {
              trainingSession: {
                id: trainingSession.id,
              },
            },
          },
        },
        include: {
          workoutExercises: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!trainingDay) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 5. Atomically create the full progress snapshot for this day
      const progressDay = await ctx.prisma.$transaction(async (tx) => {
        // Bump parent training to IN_PROGRESS if it hasn't started yet
        if (trainingSession.status === TrainingSessionStatus.NOT_STARTED) {
          await tx.trainingSession.update({
            where: { id: trainingSession.id },
            data: { status: TrainingSessionStatus.IN_PROGRESS },
          });
        }

        // Create TrainingDaySession with all nested rows
        return tx.trainingDaySession.create({
          data: {
            trainingSessionId: trainingSession.id,
            trainingDayId: trainingDay.id,
            status: TrainingDaySessionStatus.IN_PROGRESS,
            workoutExerciseSessions: {
              create: trainingDay.workoutExercises.map((exercise) => ({
                workoutExerciseId: exercise.id,
                status: WorkoutExerciseSessionStatus.NOT_STARTED,
                // Snapshot targets from the template at this point in time
                targetReps: exercise.reps,
                targetDuration: exercise.duration,
                targetDistance: exercise.distance,
                targetWeight: exercise.weight,
              })),
            },
          },
          include: {
            workoutExerciseSessions: {
              orderBy: [
                { workoutExercise: { workoutBlockType: "asc" } },
                { workoutExercise: { order: "asc" } },
              ],
              include: {
                workoutExercise: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
            trainingDay: true,
          },
        });
      });

      const response = {
        ...progressDay,
        stats: {
          ...stats,
          currentDay: progressDay.trainingDay?.order ?? 1,
          totalDays: trainingSession.training?.trainingDays.length ?? 0,
          todaysExercisesAmount: progressDay.workoutExerciseSessions.length,
        },
      };

      return trainingSessionStartDayOutputSchema.parse(response);
    }),
  getCurrentExercise: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/training.session.getCurrentDay",
        tags: ["Training:Session"],
      },
    })
    .input(trainingSessionGetCurrentExerciseInputSchema)
    .output(trainingSessionGetCurrentExerciseOutputSchema)
    .query(async ({ input, ctx }) => {
      const trainingDaySession = await ctx.prisma.trainingDaySession.findFirst({
        where: {
          trainingSession: { id: input.trainingSessionId },
          status: {
            in: [TrainingDaySessionStatus.IN_PROGRESS, TrainingDaySessionStatus.NOT_STARTED],
          },
        },
        include: { workoutExerciseSessions: true },
      });

      if (!trainingDaySession) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      const exercisesLeftAmount = await ctx.prisma.workoutExerciseSession.count({
        where: {
          status: WorkoutExerciseSessionStatus.NOT_STARTED,
          trainingDaySessionId: trainingDaySession.id,
        },
      });

      const totalExercisesAmount = await ctx.prisma.workoutExerciseSession.count({
        where: {
          trainingDaySessionId: trainingDaySession.id,
        },
      });

      const currentExercise = await ctx.prisma.workoutExerciseSession.findFirst({
        orderBy: [
          { workoutExercise: { workoutBlockType: "asc" } },
          { workoutExercise: { order: "asc" } },
        ],
        where: {
          status: {
            in: [
              WorkoutExerciseSessionStatus.IN_PROGRESS,
              WorkoutExerciseSessionStatus.NOT_STARTED,
            ],
          },
          trainingDaySessionId: trainingDaySession.id,
        },
        include: {
          workoutExercise: {
            include: {
              exercise: true,
            },
          },
        },
      });

      return trainingSessionGetCurrentExerciseOutputSchema.parse({
        currentExercise,
        exercisesLeftAmount,
        totalExercisesAmount,
      });
    }),
  startExercise: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.session.startExercise",
        tags: ["Training:Session"],
      },
    })
    .input(trainingSessionStartExerciseInputSchema)
    .output(trainingSessionStartExerciseOutputSchema)
    .mutation(async ({ input, ctx }) => {
      // 1. Verify ownership by traversing the relation chain up to customerProfileId
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: { profile: { userId: ctx.sessionUser.id } },
      });
      if (!customerProfile) {
        throw new TRPCError({ code: "FORBIDDEN", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      const progressExercise = await ctx.prisma.workoutExerciseSession.findFirst({
        where: {
          id: input.workoutExerciseSessionId,
          status: {
            not: WorkoutExerciseSessionStatus.COMPLETED,
          },
        },
      });
      if (!progressExercise) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 3. Atomically update exercise + parent block
      return ctx.prisma.workoutExerciseSession.update({
        where: { id: progressExercise.id },
        data: { status: WorkoutExerciseSessionStatus.IN_PROGRESS, startedAt: new Date() },
      });
    }),
  completeExercise: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.session.completeExercise",
        tags: ["Training:Session"],
      },
    })
    .input(trainingSessionCompleteExerciseInputSchema)
    .output(trainingSessionCompleteExerciseOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const progressExercise = await ctx.prisma.workoutExerciseSession.findFirst({
        where: {
          id: input.workoutExerciseSessionId,
          status: {
            not: WorkoutExerciseSessionStatus.COMPLETED,
          },
        },
      });

      if (!progressExercise) {
        throw new TRPCError({ code: "FORBIDDEN", message: API_PROCEDURE_ERRORS.FORBIDDEN });
      }

      const completedAt = new Date();

      return ctx.prisma.$transaction(async (tx) => {
        const updatedExercise = await tx.workoutExerciseSession.update({
          where: { id: input.workoutExerciseSessionId },
          data: {
            status: WorkoutExerciseSessionStatus.COMPLETED,
            completedAt,
            timeSpent: input.timeSpentMiliseconds,
          },
        });

        const remainingExercisesCount = await tx.workoutExerciseSession.count({
          where: {
            trainingDaySessionId: progressExercise.trainingDaySessionId,
            status: {
              notIn: [WorkoutExerciseSessionStatus.COMPLETED, WorkoutExerciseSessionStatus.SKIPPED],
            },
          },
        });

        if (remainingExercisesCount === 0) {
          await tx.trainingDaySession.update({
            where: { id: progressExercise.trainingDaySessionId },
            data: {
              status: TrainingDaySessionStatus.COMPLETED,
              finishedAt: completedAt,
            },
          });

          // Check if this was the last day in the training
          const completedDay = await tx.trainingDaySession.findUnique({
            where: { id: progressExercise.trainingDaySessionId },
            select: { trainingSessionId: true },
          });

          if (completedDay) {
            const remainingDaysCount = await tx.trainingDaySession.count({
              where: {
                trainingSessionId: completedDay.trainingSessionId,
                status: {
                  notIn: [TrainingDaySessionStatus.COMPLETED],
                },
              },
            });

            if (remainingDaysCount === 0) {
              await tx.trainingSession.update({
                where: { id: completedDay.trainingSessionId },
                data: {
                  status: TrainingSessionStatus.COMPLETED,
                },
              });
            }
          }
        }

        return updatedExercise;
      });
    }),
});
