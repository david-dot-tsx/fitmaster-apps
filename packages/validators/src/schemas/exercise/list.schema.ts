import z from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";
import { withTimestampsSchema } from "../../utils/objects";

export const exerciseListOutputSchema = z.array(
  exerciseBaseWithIdSchema.extend(withTimestampsSchema.shape),
);
export type ExerciseListOutput = z.infer<typeof exerciseListOutputSchema>;
