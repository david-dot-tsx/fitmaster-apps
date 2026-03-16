import z from "zod";

import { ProgressCustomerWorkoutExerciseStatus } from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withTimestampsSchema } from "../../../utils/objects";

export const startExerciseEnrolmentInputSchema = z.object({
  progressCustomerWorkoutExerciseId: idSchema,
});
export type StartExerciseEnrolmentInput = z.infer<typeof startExerciseEnrolmentInputSchema>;

export const startExerciseEnrolmentOutputSchema = z
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

export type StartExerciseEnrolmentOutput = z.infer<typeof startExerciseEnrolmentOutputSchema>;
