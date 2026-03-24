import { z } from "zod";

import { idSchema } from "../../../utils/common-types";
import { trainingSessionWorkoutSchema } from "./shared.schema";
import { workoutExerciseBaseSchema } from "../../trainingDay";

export const trainingSessionGetCurrentExerciseInputSchema = z.object({
  trainingSessionId: idSchema,
});
export type TrainingSessionGetCurrentExerciseInput = z.infer<
  typeof trainingSessionGetCurrentExerciseInputSchema
>;
const trainingSessionCurrentExerciseSchema = trainingSessionWorkoutSchema
  .and(
    z.object({
      workoutExercise: workoutExerciseBaseSchema,
    }),
  )
  .nullable();

export const trainingSessionGetCurrentExerciseOutputSchema = z.object({
  currentExercise: trainingSessionCurrentExerciseSchema,
  exercisesLeftAmount: z.number(),
  totalExercisesAmount: z.number(),
});

export type TrainingSessionGetCurrentExerciseOutput = z.infer<
  typeof trainingSessionGetCurrentExerciseOutputSchema
>;
