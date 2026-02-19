import { z } from "zod";

import { WorkoutType } from "@repo/db/types";

import { idSchema } from "../../utils/common-types";
import { workoutBlockTypesSchema } from "./shared.schema";

const WORKOUT_BLOCK_EXERCISE_MIN_LENGTH = {
  [workoutBlockTypesSchema.enum.WARM_UP]: 1,
  [workoutBlockTypesSchema.enum.MAIN_WORKOUT]: 2,
  [workoutBlockTypesSchema.enum.COOL_DOWN]: 0,
};
/**
 * Form schema
 */
export const workoutBlockExerciseSchema = z.object({
  exerciseId: idSchema,
  workoutType: z
    .enum(WorkoutType)
    .nullable()
    .refine((v) => Object.values(WorkoutType).find((type) => type === v)),
  reps: z.number().nullable(),
  duration: z.number().nullable(),
  distance: z.number().nullable(),
  weight: z.number().nullable(),
});
export type WorkoutBlockExercise = z.infer<typeof workoutBlockExerciseSchema>;

const workoutCreateBlockBaseSchema = z.object({
  exercises: z.array(workoutBlockExerciseSchema),
});
export type WorkoutCreateBlockBase = z.infer<typeof workoutCreateBlockBaseSchema>;

export const workoutBlockWarmUpSchema = workoutCreateBlockBaseSchema.extend({
  exercises: z
    .array(workoutBlockExerciseSchema)
    .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.WARM_UP]),
});
export type WorkoutBlockWarmUp = z.infer<typeof workoutBlockWarmUpSchema>;

export const workoutBlockMainWorkoutSchema = workoutCreateBlockBaseSchema.extend({
  exercises: z
    .array(workoutBlockExerciseSchema)
    .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.MAIN_WORKOUT]),
});
export type WorkoutBlockMainWorkout = z.infer<typeof workoutBlockMainWorkoutSchema>;

export const workoutBlockCoolDownSchema = workoutCreateBlockBaseSchema.extend({
  exercises: z
    .array(workoutBlockExerciseSchema)
    .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.COOL_DOWN]),
});
export type WorkoutBlockCoolDown = z.infer<typeof workoutBlockCoolDownSchema>;

/**
 * TRPC PROCEDURE INPUT SCHEMA
 */

const workoutBlockExerciseInputSchema = workoutBlockExerciseSchema.extend({
  workoutType: z.enum(WorkoutType),
});

export const trainingDayCreateInputSchema = z.object({
  workoutBlocks: z.object({
    [workoutBlockTypesSchema.enum.WARM_UP]: workoutCreateBlockBaseSchema.extend({
      exercises: z
        .array(workoutBlockExerciseInputSchema)
        .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.WARM_UP]),
    }),
    [workoutBlockTypesSchema.enum.MAIN_WORKOUT]: workoutCreateBlockBaseSchema.extend({
      exercises: z
        .array(workoutBlockExerciseInputSchema)
        .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.MAIN_WORKOUT]),
    }),
    [workoutBlockTypesSchema.enum.COOL_DOWN]: workoutCreateBlockBaseSchema.extend({
      exercises: z
        .array(workoutBlockExerciseInputSchema)
        .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.COOL_DOWN]),
    }),
  }),
  trainingId: idSchema,
});
export type TrainingDayCreateInput = z.infer<typeof trainingDayCreateInputSchema>;

export const trainingDayCreateOutputSchema = z.object({
  id: idSchema,
});
export type TrainingDayCreateOutput = z.infer<typeof trainingDayCreateOutputSchema>;
