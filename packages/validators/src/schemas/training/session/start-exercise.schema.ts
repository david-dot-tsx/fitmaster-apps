import z from "zod";

import { idSchema } from "../../../utils/common-types";
import { trainingSessionWorkoutSchema } from "./shared.schema";

export const trainingSessionStartExerciseInputSchema = z.object({
  workoutExerciseSessionId: idSchema,
});
export type TrainingSessionStartExerciseInput = z.infer<
  typeof trainingSessionStartExerciseInputSchema
>;

export const trainingSessionStartExerciseOutputSchema = trainingSessionWorkoutSchema;

export type TrainingSessionStartExerciseOutput = z.infer<
  typeof trainingSessionStartExerciseOutputSchema
>;
