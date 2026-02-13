import { z } from "zod";

import { idSchema } from "../../utils/common-types";

export const trainingDeleteInputSchema = z.object({
  id: idSchema,
});
export type TrainingDeleteInput = z.infer<typeof trainingDeleteInputSchema>;

export const trainingDeleteOutputSchema = z.object({
  id: idSchema,
});
export type TrainingDeleteOutput = z.infer<typeof trainingDeleteOutputSchema>;
