import { type z } from "zod";

import { withIdSchema } from "../../utils/objects";

export const exerciseDeleteInputSchema = withIdSchema;
export type ExerciseDeleteInput = z.infer<typeof exerciseDeleteInputSchema>;

export const exerciseDeleteOutputSchema = withIdSchema;
export type ExerciseDeleteOutput = z.infer<typeof exerciseDeleteOutputSchema>;
