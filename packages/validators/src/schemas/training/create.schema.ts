import { type z } from "zod";

import { trainingBaseSchema, trainingSchema } from "./shared.schema";

export const trainingCreateInputSchema = trainingBaseSchema;
export type TrainingCreateInput = z.infer<typeof trainingCreateInputSchema>;

export const trainingCreateInputFormSchema = trainingBaseSchema;
export type TrainingCreateInputForm = z.infer<typeof trainingCreateInputFormSchema>;

export const trainingCreateOutputSchema = trainingSchema;
export type TrainingCreateOutput = z.infer<typeof trainingCreateOutputSchema>;
