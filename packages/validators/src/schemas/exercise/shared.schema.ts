import z from "zod";

import { Difficulty, BodyPart } from "@repo/db/types";

export const exerciseBaseSchema = z.object({
  name: z.string().nonempty(),
  difficulty: z.enum(Difficulty),
  bodyPart: z.enum(BodyPart),
  description: z.string().nullable(),
  imageUrl: z.url(),
});
export type ExerciseBase = z.infer<typeof exerciseBaseSchema>;

export const exerciseBaseWithIdSchema = exerciseBaseSchema.extend({
  id: z.string(),
});
export type ExerciseBaseWithId = z.infer<typeof exerciseBaseWithIdSchema>;

export { Difficulty, BodyPart };
