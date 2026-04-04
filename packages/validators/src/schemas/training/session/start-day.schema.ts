import z from "zod";

import { idSchema } from "../../../utils/common-types";
import { withIdSchema, withTimestampsSchema } from "../../../utils/objects";
import {
  TrainingDaySessionStatus,
  trainingSessionWorkoutSchema,
  baseTrainingSessionStatsSchema,
  trainingSessionSchema,
} from "./shared.schema";
import { workoutExerciseBaseSchema } from "../../trainingDay/shared.schema";
import { trainingSchema } from "../shared.schema";

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
    trainingSession: trainingSessionSchema.and(z.object({ training: trainingSchema })),
    status: z.enum(TrainingDaySessionStatus),
    workoutExerciseSessions: z.array(trainingSessionWorkoutWithDetailsSchema),
    startedAt: z.date(),
    finishedAt: z.date().nullable(),
    stats: baseTrainingSessionStatsSchema.and(
      z.object({
        todaysExercisesAmount: z.number(),
      }),
    ),
  })
  .and(withIdSchema)
  .and(withTimestampsSchema);

export type TrainingSessionStartDayOutput = z.infer<typeof trainingSessionStartDayOutputSchema>;
