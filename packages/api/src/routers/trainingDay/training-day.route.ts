import { entries, mapValues, pick } from "remeda";

import {
  trainingDayCreateInputSchema,
  trainingDayCreateOutputSchema,
  trainingDayListInputSchema,
  trainingDayListOutputSchema,
  workoutBlockTypesSchema,
} from "@repo/validators";

import { publicProcedure, router, staffProcedure } from "../../server/trpc";

export const trainingDay = router({
  create: staffProcedure
    .meta({ openapi: { method: "POST", path: "/trainingDay.create", tags: ["TrainingDay"] } })
    .input(trainingDayCreateInputSchema)
    .output(trainingDayCreateOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const newTrainingDay = await ctx.prisma.trainingDay.create({
        data: {
          trainingId: input.trainingId,
          workoutBlocks: {
            create: entries(input.workoutBlocks).map(([key, value]) => {
              return {
                workoutBlockType: key,
                workoutExercises: {
                  create: value.exercises.map((exercise) => {
                    return {
                      reps: exercise.reps,
                      duration: exercise.duration,
                      distance: exercise.distance,
                      weight: exercise.weight,
                      workoutType: exercise.workoutType,
                      exercise: {
                        connect: {
                          id: exercise.exerciseId,
                        },
                      },
                    };
                  }),
                },
              };
            }),
          },
        },
      });

      return { id: newTrainingDay.id };
    }),
  getTrainingsDays: publicProcedure
    .meta({ openapi: { method: "GET", path: "/trainingDay.list", tags: ["TrainingDay"] } })
    .input(trainingDayListInputSchema)
    .output(trainingDayListOutputSchema)
    .query(async ({ input, ctx }) => {
      const trainingDays = await ctx.prisma.trainingDay.findMany({
        where: { trainingId: input.trainingId },
        include: {
          workoutBlocks: {
            include: {
              workoutExercises: {
                include: {
                  exercise: true,
                },
              },
            },
          },
        },
      });

      const mappedTrainingDays = trainingDays.map((trainingDay) => {
        const mappedBlocks = mapValues(workoutBlockTypesSchema.enum, (blockType) => {
          const foundBlock = trainingDay.workoutBlocks.find(
            (block) => block.workoutBlockType === blockType,
          );

          return foundBlock ?? null;
        });

        const pickedValues = pick(trainingDay, ["id", "createdAt", "updatedAt"]);

        return { ...pickedValues, workoutBlocks: mappedBlocks };
      });

      return mappedTrainingDays;
    }),
});
