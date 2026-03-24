import z from "zod";

import { idSchema } from "../../../utils/common-types";

export const trainingSessionNewInputSchema = z.object({
  trainingId: idSchema,
});
export type TrainingSessionNewInput = z.infer<typeof trainingSessionNewInputSchema>;

export const trainingSessionNewOutputSchema = z.object({
  id: idSchema,
});
export type TrainingSessionNewOutput = z.infer<typeof trainingSessionNewOutputSchema>;
