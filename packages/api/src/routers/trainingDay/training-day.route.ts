import { entries, mapValues, pick } from "remeda";

import {
  trainingDayCreateInputSchema,
  trainingDayCreateOutputSchema,
  trainingDayListInputSchema,
  trainingDayListOutputSchema,
  workoutBlockTypesSchema,
} from "@repo/validators";

import { router, staffProcedure } from "../../server/trpc";

export const trainingDay = router({
  create: staffProcedure
    .meta({ openapi: { method: "POST", path: "/trainingDay.create", tags: ["TrainingDay"] } })
    .input(trainingDayCreateInputSchema)
    .output(trainingDayCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const lastTrainingDay = await ctx.prisma.trainingDay.findFirst({
        where: { trainingId: input.trainingId },
        orderBy: {
          order: "desc",
        },
      });

      const currentOrder = lastTrainingDay ? lastTrainingDay.order + 1 : 1;

      const newTrainingDay = await ctx.prisma.trainingDay.create({
        data: {
          trainingId: input.trainingId,
          order: currentOrder,
          workoutExercises: {
            create: entries(input.workoutBlocks)
              .map(([key, value]) => {
                return value.exercises.map((exercise, index) => {
                  return {
                    reps: exercise.reps,
                    duration: exercise.duration,
                    distance: exercise.distance,
                    weight: exercise.weight,
                    workoutType: exercise.workoutType,
                    order: index + 1,
                    workoutBlockType: key,
                    exercise: {
                      connect: {
                        id: exercise.exerciseId,
                      },
                    },
                  };
                });
              })
              .flat(),
          },
        },
      });

      return { id: newTrainingDay.id };
    }),
  getTrainingsDays: staffProcedure
    .meta({ openapi: { method: "GET", path: "/trainingDay.list", tags: ["TrainingDay"] } })
    .input(trainingDayListInputSchema)
    .output(trainingDayListOutputSchema)
    .query(async ({ input, ctx }) => {
      const trainingDays = await ctx.prisma.trainingDay.findMany({
        where: { trainingId: input.trainingId },
        include: {
          workoutExercises: {
            include: {
              exercise: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      const mappedTrainingDays = trainingDays.map((trainingDay) => {
        const blocks = mapValues(workoutBlockTypesSchema.enum, (blockType) => {
          return trainingDay.workoutExercises.filter(
            (exercise) => exercise.workoutBlockType === blockType,
          );
        });
        const pickedValues = pick(trainingDay, ["id", "order", "createdAt", "updatedAt"]);

        return { ...pickedValues, workoutBlocks: blocks };
      });

      return mappedTrainingDays;
    }),
});
