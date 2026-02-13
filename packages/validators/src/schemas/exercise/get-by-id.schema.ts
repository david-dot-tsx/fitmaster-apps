import { type z } from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";
import { withIdSchema, withTimestampsSchema } from "../../utils/objects";

export const exerciseGetByIdInputSchema = withIdSchema;
export type ExerciseGetByIdInput = z.infer<typeof exerciseGetByIdInputSchema>;

export const exerciseGetByIdOutputSchema = exerciseBaseWithIdSchema.extend(
  withTimestampsSchema.shape,
);
export type ExerciseGetByIdOutput = z.infer<typeof exerciseGetByIdOutputSchema>;
