import z from "zod";

import { idSchema } from "../../../utils/common-types";
import { trainingSessionWorkoutSchema } from "./shared.schema";

export const trainingSessionCompleteExerciseInputSchema = z.object({
  workoutExerciseSessionId: idSchema,
  timeSpentMiliseconds: z.number(),
});
export type TrainingSessionCompleteExerciseInput = z.infer<
  typeof trainingSessionCompleteExerciseInputSchema
>;

export const trainingSessionCompleteExerciseOutputSchema = trainingSessionWorkoutSchema;

export type TrainingSessionCompleteExerciseOutput = z.infer<
  typeof trainingSessionCompleteExerciseOutputSchema
>;
