import { TRPCError } from "@trpc/server";

import {
  getCurrentExerciseEnrolmentInputSchema,
  getCurrentExerciseEnrolmentOutputSchema,
  joinTrainingEnrolmentInputSchema,
  joinTrainingEnrolmentOutputSchema,
  myTrainingsEnrolmentOutputSchema,
  startDayEnrolmentInputSchema,
  startDayEnrolmentOutputSchema,
  startExerciseEnrolmentInputSchema,
  startExerciseEnrolmentOutputSchema,
  startTrainingEnrolmentInputSchema,
  startTrainingEnrolmentOutputSchema,
} from "@repo/validators";
import {
  CustomerProgressTrainingStatus,
  ProgressCustomerTrainingDayStatus,
  ProgressCustomerWorkoutBlockStatus,
  ProgressCustomerWorkoutExerciseStatus,
} from "@repo/db/types";

import { router, customerProcedure } from "../../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../../consts/api-procedure-errors";

export const trainingEnrolment = router({
  join: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.enrolment.join",
        tags: ["Training:Enrolment"],
      },
    })
    .input(joinTrainingEnrolmentInputSchema)
    .output(joinTrainingEnrolmentOutputSchema)
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
      const trainingEnrollment = await ctx.prisma.progressCustomerTraining.create({
        data: {
          customerProfileId: customerProfile.id,
          trainingId: input.trainingId,
        },
      });

      return { id: trainingEnrollment.id };
    }),

  myTrainings: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/training.enrolment.myTrainings",
        tags: ["Training:Enrolment"],
      },
    })
    .output(myTrainingsEnrolmentOutputSchema)
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

      const enrolledTrainings = await ctx.prisma.progressCustomerTraining.findMany({
        where: {
          customerProfileId: customerProfile.id,
        },
      });

      return enrolledTrainings;
    }),

  // Creates ProgressCustomerTrainingDay + all nested blocks & exercises in one transaction.
  // Idempotent: if the day was already started, returns the existing record.
  startDay: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.enrolment.startDay",
        tags: ["Training:Enrolment"],
      },
    })
    .input(startDayEnrolmentInputSchema)
    .output(startDayEnrolmentOutputSchema)
    .mutation(async ({ input, ctx }) => {
      // 1. Verify enrolment belongs to authenticated customer
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: { profile: { userId: ctx.sessionUser.id } },
      });
      if (!customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      const enrolment = await ctx.prisma.progressCustomerTraining.findFirst({
        where: {
          id: input.progressCustomerTrainingId,
          customerProfileId: customerProfile.id,
        },
        include: {
          progressCustomerTrainingDays: true,
        },
      });
      if (!enrolment) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 2. Idempotency: return existing progress day if already started
      const existingProgressDay = await ctx.prisma.progressCustomerTrainingDay.findFirst({
        where: {
          progressCustomerTrainingId: input.progressCustomerTrainingId,
          status: ProgressCustomerTrainingDayStatus.IN_PROGRESS,
        },
        include: {
          progressCustomerWorkoutBlocks: {
            include: { progressCustomerWorkoutExercises: true },
          },
        },
      });
      if (existingProgressDay) {
        return existingProgressDay;
      }

      /**
       * 3. Load the training day template with all blocks and exercises
       *  - where the training day belongs to the training
       *  - where none of that
       *
       */
      const trainingDay = await ctx.prisma.trainingDay.findFirst({
        where: {
          trainingId: enrolment.trainingId,
          progressCustomerTrainingDays: {
            none: {
              progressCustomerTraining: {
                id: enrolment.id,
              },
            },
          },
        },
        include: {
          workoutBlocks: {
            where: { deletedAt: null },
            include: {
              workoutExercises: {
                where: { deletedAt: null },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });

      if (!trainingDay) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 4. Atomically create the full progress snapshot for this day
      return ctx.prisma.$transaction(async (tx) => {
        // Bump parent training to IN_PROGRESS if it hasn't started yet
        if (enrolment.status === CustomerProgressTrainingStatus.NOT_STARTED) {
          await tx.progressCustomerTraining.update({
            where: { id: enrolment.id },
            data: { status: CustomerProgressTrainingStatus.IN_PROGRESS },
          });
        }

        // Create ProgressCustomerTrainingDay with all nested rows
        return tx.progressCustomerTrainingDay.create({
          data: {
            progressCustomerTrainingId: enrolment.id,
            trainingDayId: trainingDay.id,
            status: ProgressCustomerTrainingDayStatus.IN_PROGRESS,
            progressCustomerWorkoutBlocks: {
              create: trainingDay.workoutBlocks.map((block) => ({
                workoutBlockId: block.id,
                status: ProgressCustomerWorkoutBlockStatus.NOT_STARTED,
                progressCustomerWorkoutExercises: {
                  create: block.workoutExercises.map((exercise) => ({
                    workoutExerciseId: exercise.id,
                    status: ProgressCustomerWorkoutExerciseStatus.NOT_STARTED,
                    // Snapshot targets from the template at this point in time
                    targetReps: exercise.reps,
                    targetDuration: exercise.duration,
                    targetDistance: exercise.distance,
                    targetWeight: exercise.weight,
                  })),
                },
              })),
            },
          },
          include: {
            progressCustomerWorkoutBlocks: {
              include: { progressCustomerWorkoutExercises: true },
            },
          },
        });
      });
    }),
  getCurrentExercise: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/training.enrolment.getCurrentDay",
        tags: ["Training:Enrolment"],
      },
    })
    .input(getCurrentExerciseEnrolmentInputSchema)
    .output(getCurrentExerciseEnrolmentOutputSchema)
    .query(async ({ input, ctx }) => {
      const currentExercise = await ctx.prisma.progressCustomerWorkoutExercise.findFirst({
        orderBy: { workoutExercise: { order: "asc" } },
        where: {
          status: {
            in: [
              ProgressCustomerWorkoutExerciseStatus.IN_PROGRESS,
              ProgressCustomerWorkoutExerciseStatus.NOT_STARTED,
            ],
          },
          progressCustomerWorkoutBlock: {
            progressCustomerTrainingDay: {
              status: {
                in: [
                  ProgressCustomerTrainingDayStatus.IN_PROGRESS,
                  ProgressCustomerTrainingDayStatus.NOT_STARTED,
                ],
              },
              progressCustomerTraining: { id: input.progressCustomerTrainingId },
            },
          },
        },
        include: {
          workoutExercise: true,
          progressCustomerWorkoutBlock: {
            include: {
              workoutBlock: true,
            },
          },
        },
      });
      const enrolment = await ctx.prisma.progressCustomerTraining.findFirst({
        where: { id: input.progressCustomerTrainingId },
      });

      const currentTraining = await ctx.prisma.training.findFirst({
        where: { id: enrolment?.trainingId },
        include: {
          trainingDays: {
            include: {
              workoutBlocks: {
                orderBy: { createdAt: "asc" },
                include: {
                  workoutExercises: {
                    orderBy: { createdAt: "asc" },
                    include: { progressCustomerWorkoutExercises: true },
                  },
                },
              },
            },
          },
        },
      });
      console.log({ currentExercise, currentTraining });

      return {
        res: "ok",
        obj: {
          currentExercise: { ...currentExercise },
          currentTraining: { ...currentTraining },
        },
      };
    }),
  // Marks a single exercise as IN_PROGRESS and bumps its parent block too.
  startExercise: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.enrolment.startExercise",
        tags: ["Training:Enrolment"],
      },
    })
    .input(startExerciseEnrolmentInputSchema)
    .output(startExerciseEnrolmentOutputSchema)
    .mutation(async ({ input, ctx }) => {
      // 1. Verify ownership by traversing the relation chain up to customerProfileId
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: { profile: { userId: ctx.sessionUser.id } },
      });
      if (!customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      const progressExercise = await ctx.prisma.progressCustomerWorkoutExercise.findFirst({
        where: {
          id: input.progressCustomerWorkoutExerciseId,
          progressCustomerWorkoutBlock: {
            progressCustomerTrainingDay: {
              progressCustomerTraining: {
                customerProfileId: customerProfile.id,
              },
            },
          },
        },
      });
      if (!progressExercise) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }

      // 2. If already past NOT_STARTED, return as-is (idempotent)
      if (progressExercise.status !== ProgressCustomerWorkoutExerciseStatus.NOT_STARTED) {
        return progressExercise;
      }

      // 3. Atomically update exercise + parent block
      return ctx.prisma.$transaction(async (tx) => {
        // Bump parent block to IN_PROGRESS if it hasn't started yet
        await tx.progressCustomerWorkoutBlock.updateMany({
          where: {
            id: progressExercise.progressCustomerWorkoutBlockId,
            status: ProgressCustomerWorkoutBlockStatus.NOT_STARTED,
          },
          data: { status: ProgressCustomerWorkoutBlockStatus.IN_PROGRESS },
        });

        return tx.progressCustomerWorkoutExercise.update({
          where: { id: progressExercise.id },
          data: { status: ProgressCustomerWorkoutExerciseStatus.IN_PROGRESS },
        });
      });
    }),
});
