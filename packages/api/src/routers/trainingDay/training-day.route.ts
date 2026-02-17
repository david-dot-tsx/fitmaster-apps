import { entries } from "remeda";

import { trainingDayCreateInputSchema, trainingDayCreateOutputSchema } from "@repo/validators";

import { router, staffProcedure } from "../../server/trpc";

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
});
