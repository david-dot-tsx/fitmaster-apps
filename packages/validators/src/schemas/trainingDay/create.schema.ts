import { z } from "zod";

import { WorkoutBlockType as DbWorkoutBlockType, WorkoutType } from "@repo/db/types";

import { idSchema } from "../../utils/common-types";

export const workoutBlockTypesSchema = z.enum([
  DbWorkoutBlockType.WARM_UP,
  DbWorkoutBlockType.MAIN_WORKOUT,
  DbWorkoutBlockType.COOL_DOWN,
]);
export type WorkoutBlockTypes = z.infer<typeof workoutBlockTypesSchema>;

const WORKOUT_BLOCK_EXERCISE_MIN_LENGTH = {
  [workoutBlockTypesSchema.enum.WARM_UP]: 1,
  [workoutBlockTypesSchema.enum.MAIN_WORKOUT]: 2,
  [workoutBlockTypesSchema.enum.COOL_DOWN]: 0,
};
/**
 * TRPC Procedure Input Schema
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

export const workoutBlockBaseSchema = z.object({
  exercises: z.array(workoutBlockExerciseSchema),
});

export type WorkoutBlockBase = z.infer<typeof workoutBlockBaseSchema>;

export const workoutBlockWarmUpSchema = workoutBlockBaseSchema.extend({
  exercises: z
    .array(workoutBlockExerciseSchema)
    .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.WARM_UP]),
});
export type WorkoutBlockWarmUp = z.infer<typeof workoutBlockWarmUpSchema>;

export const workoutBlockMainWorkoutSchema = workoutBlockBaseSchema.extend({
  exercises: z
    .array(workoutBlockExerciseSchema)
    .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.MAIN_WORKOUT]),
});
export type WorkoutBlockMainWorkout = z.infer<typeof workoutBlockMainWorkoutSchema>;

export const workoutBlockCoolDownSchema = workoutBlockBaseSchema.extend({
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
    [workoutBlockTypesSchema.enum.WARM_UP]: workoutBlockBaseSchema.extend({
      exercises: z
        .array(workoutBlockExerciseInputSchema)
        .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.WARM_UP]),
    }),
    [workoutBlockTypesSchema.enum.MAIN_WORKOUT]: workoutBlockBaseSchema.extend({
      exercises: z
        .array(workoutBlockExerciseInputSchema)
        .min(WORKOUT_BLOCK_EXERCISE_MIN_LENGTH[workoutBlockTypesSchema.enum.MAIN_WORKOUT]),
    }),
    [workoutBlockTypesSchema.enum.COOL_DOWN]: workoutBlockBaseSchema.extend({
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
