import z from "zod";

import { WorkoutType, WorkoutBlockType as DbWorkoutBlockType } from "@repo/db/types";

import { idSchema } from "../../utils/common-types";
import { withIdSchema, withTimestampsSchema } from "../../utils/objects";
import { exerciseBaseWithIdSchema } from "../exercise/shared.schema";

export { WorkoutType };

export const workoutBlockTypesSchema = z.enum([
  DbWorkoutBlockType.WARM_UP,
  DbWorkoutBlockType.MAIN_WORKOUT,
  DbWorkoutBlockType.COOL_DOWN,
]);
export type WorkoutBlockTypes = z.infer<typeof workoutBlockTypesSchema>;

export const workoutBlockExerciseBaseSchema = z
  .object({
    exerciseId: idSchema,
    workoutType: z.enum(WorkoutType),
    reps: z.number().nullable(),
    duration: z.number().nullable(),
    distance: z.number().nullable(),
    weight: z.number().nullable(),
  })
  .and(withTimestampsSchema)
  .and(withIdSchema);
export type WorkoutBlockExerciseBase = z.infer<typeof workoutBlockExerciseBaseSchema>;

export const workoutExerciseBaseSchema = z
  .object({
    reps: z.number().nullable(),
    duration: z.number().nullable(),
    distance: z.number().nullable(),
    weight: z.number().nullable(),
    exercise: exerciseBaseWithIdSchema,
  })
  .and(withIdSchema);

export const workoutBlockBaseSchema = z
  .object({
    trainingDayId: idSchema,
    workoutExercises: z.array(workoutExerciseBaseSchema),
  })
  .and(withIdSchema)
  .nullable();
export type WorkoutBlockBase = z.infer<typeof workoutBlockBaseSchema>;

export const trainingDayDetailedSchema = z
  .object({
    workoutBlocks: z.record(workoutBlockTypesSchema, workoutBlockBaseSchema),
  })
  .and(withTimestampsSchema)
  .and(withIdSchema);
export type TrainingDayDetailed = z.infer<typeof trainingDayDetailedSchema>;
