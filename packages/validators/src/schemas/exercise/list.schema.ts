import z from "zod";

import { exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseListOutputSchema = z.array(
  exerciseBaseWithIdSchema.extend({
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);
export type ExerciseListOutput = z.infer<typeof exerciseListOutputSchema>;
