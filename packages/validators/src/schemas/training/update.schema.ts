import { z } from "zod";

import { trainingBaseSchema, trainingSchema } from "./shared.schema";
import { idSchema } from "../../utils/common-types";

export const trainingUpdateInputSchema = z.object({
  id: idSchema,
  data: trainingBaseSchema,
});
export type TrainingUpdateInput = z.infer<typeof trainingUpdateInputSchema>;

export const trainingUpdateInputFormSchema = trainingBaseSchema.extend({
  id: idSchema,
});
export type TrainingUpdateInputForm = z.infer<typeof trainingUpdateInputFormSchema>;

export const trainingUpdateOutputSchema = trainingSchema;
export type TrainingUpdateOutput = z.infer<typeof trainingUpdateOutputSchema>;
