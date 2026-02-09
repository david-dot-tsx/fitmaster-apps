import type z from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseUpdateInputSchema = exerciseBaseWithIdSchema;
export type ExerciseUpdateInput = z.infer<typeof exerciseUpdateInputSchema>;

export const exerciseUpdateOutputSchema = exerciseBaseWithIdSchema;

export type ExerciseUpdateOutput = z.infer<typeof exerciseUpdateOutputSchema>;
