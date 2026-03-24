import z from "zod";

import { idSchema } from "../../../utils/common-types";
import { withIdSchema, withTimestampsSchema } from "../../../utils/objects";
import { TrainingDaySessionStatus, trainingSessionWorkoutSchema } from "./shared.schema";
import { workoutExerciseBaseSchema } from "../../trainingDay/shared.schema";

export const trainingSessionStartDayInputSchema = z.object({
  trainingSessionId: idSchema,
});
export type TrainingSessionStartDayInput = z.infer<typeof trainingSessionStartDayInputSchema>;

export const trainingSessionWorkoutWithDetailsSchema = trainingSessionWorkoutSchema.and(
  z.object({
    workoutExercise: workoutExerciseBaseSchema,
  }),
);
export type TrainingSessionWorkoutWithDetails = z.infer<
  typeof trainingSessionWorkoutWithDetailsSchema
>;

export const trainingSessionStartDayOutputSchema = z
  .object({
    trainingDayId: idSchema,
    trainingSessionId: idSchema,
    status: z.enum(TrainingDaySessionStatus),
    workoutExerciseSessions: z.array(trainingSessionWorkoutWithDetailsSchema),
    startedAt: z.date(),
    finishedAt: z.date().nullable(),
    stats: z.object({
      todaysExercisesAmount: z.number(),
      currentDay: z.number(),
      totalDays: z.number(),
    }),
  })
  .and(withIdSchema)
  .and(withTimestampsSchema);

export type TrainingSessionStartDayOutput = z.infer<typeof trainingSessionStartDayOutputSchema>;
