import { z } from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseGetByIdInputSchema = z.object({
  id: z.uuid(),
});
export type ExerciseGetByIdInput = z.infer<typeof exerciseGetByIdInputSchema>;

export const exerciseGetByIdOutputSchema = exerciseBaseWithIdSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ExerciseGetByIdOutput = z.infer<typeof exerciseGetByIdOutputSchema>;
