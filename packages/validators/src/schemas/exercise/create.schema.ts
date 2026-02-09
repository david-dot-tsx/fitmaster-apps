import type z from "zod";

import { exerciseBaseSchema, exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseCreateInputSchema = exerciseBaseSchema;
export type ExerciseCreateInput = z.infer<typeof exerciseCreateInputSchema>;

export const exerciseCreateOutputSchema = exerciseBaseWithIdSchema;
