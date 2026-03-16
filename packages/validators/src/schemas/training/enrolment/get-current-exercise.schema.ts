import { z } from "zod";

import { idSchema } from "../../../utils/common-types";

export const getCurrentExerciseEnrolmentInputSchema = z.object({
  progressCustomerTrainingId: idSchema,
});
export type GetCurrentExerciseEnrolmentInput = z.infer<
  typeof getCurrentExerciseEnrolmentInputSchema
>;

export const getCurrentExerciseEnrolmentOutputSchema = z.object({
  res: z.string(),
  obj: z
    .object({
      currentExercise: z.any(),
      currentTraining: z.any(),
    })
    .nullable(),
});
