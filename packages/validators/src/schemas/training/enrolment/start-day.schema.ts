import z from "zod";

import {
  ProgressCustomerTrainingDayStatus,
  ProgressCustomerWorkoutBlockStatus,
  ProgressCustomerWorkoutExerciseStatus,
} from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withTimestampsSchema } from "../../../utils/objects";

export const startDayEnrolmentInputSchema = z.object({
  progressCustomerTrainingId: idSchema,
  // trainingDayId: idSchema,
});
export type StartDayEnrolmentInput = z.infer<typeof startDayEnrolmentInputSchema>;

const progressWorkoutExerciseSchema = z
  .object({
    id: idSchema,
    workoutExerciseId: idSchema,
    progressCustomerWorkoutBlockId: idSchema,
    status: z.enum(ProgressCustomerWorkoutExerciseStatus),
    exercisetime: z.int().nullable(),
    targetReps: z.int().nullable(),
    targetDuration: z.int().nullable(),
    targetDistance: z.int().nullable(),
    targetWeight: z.number().nullable(),
    actualReps: z.int().nullable(),
    actualDuration: z.int().nullable(),
    actualDistance: z.int().nullable(),
    actualWeight: z.number().nullable(),
    deletedAt: z.date().nullable(),
  })
  .and(withTimestampsSchema);

const progressWorkoutBlockSchema = z
  .object({
    id: idSchema,
    workoutBlockId: idSchema,
    progressCustomerTrainingDayId: idSchema,
    status: z.enum(ProgressCustomerWorkoutBlockStatus),
    deletedAt: z.date().nullable(),
    progressCustomerWorkoutExercises: z.array(progressWorkoutExerciseSchema),
  })
  .and(withTimestampsSchema);

export const startDayEnrolmentOutputSchema = z
  .object({
    id: idSchema,
    trainingDayId: idSchema,
    progressCustomerTrainingId: idSchema,
    status: z.enum(ProgressCustomerTrainingDayStatus),
    deletedAt: z.date().nullable(),
    progressCustomerWorkoutBlocks: z.array(progressWorkoutBlockSchema),
  })
  .and(withTimestampsSchema);

export type StartDayEnrolmentOutput = z.infer<typeof startDayEnrolmentOutputSchema>;
