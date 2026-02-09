import z from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseListOutputSchema = z.array(exerciseBaseWithIdSchema);
export type ExerciseListOutput = z.infer<typeof exerciseListOutputSchema>;
