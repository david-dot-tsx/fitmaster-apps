import z from "zod";

import {
  WorkoutExerciseSessionStatus,
  WorkoutBlockType,
  TrainingDaySessionStatus,
  TrainingSessionStatus,
} from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withIdSchema, withTimestampsSchema } from "../../../utils/objects";

export const baseTrainingSessionStatsSchema = z.object({
  currentDay: z.number().int().nonnegative(),
  totalDays: z.number().int().nonnegative(),
  hasUserCompletedThisDay: z.boolean(),
});
export type BaseTrainingSessionStats = z.infer<typeof baseTrainingSessionStatsSchema>;

export const trainingSessionSchema = z
  .object({
    id: idSchema,
    customerProfileId: idSchema,
    trainingId: idSchema,
    status: z.enum(TrainingSessionStatus),
  })
  .and(withTimestampsSchema)
  .and(withIdSchema);
export type TrainingSession = z.infer<typeof trainingSessionSchema>;

export const trainingSessionWorkoutSchema = z
  .object({
    workoutExerciseId: idSchema,
    status: z.enum(WorkoutExerciseSessionStatus),
    timeSpent: z.int().nullable(),
    targetReps: z.int().nullable(),
    targetDuration: z.int().nullable(),
    targetDistance: z.int().nullable(),
    targetWeight: z.number().nullable(),
    actualReps: z.int().nullable(),
    actualDuration: z.int().nullable(),
    actualDistance: z.int().nullable(),
    actualWeight: z.number().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
  })
  .and(withTimestampsSchema)
  .and(withIdSchema);
export type TrainingSessionWorkout = z.infer<typeof trainingSessionWorkoutSchema>;

export {
  WorkoutBlockType,
  WorkoutExerciseSessionStatus,
  TrainingDaySessionStatus,
  TrainingSessionStatus,
};
