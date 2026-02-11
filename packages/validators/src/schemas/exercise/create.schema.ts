import { z } from "zod";

import {
  BodyPart,
  Difficulty,
  exerciseBaseSchema,
  exerciseBaseWithIdSchema,
} from "./shared.schema";

export const exerciseCreateInputSchema = exerciseBaseSchema;
export type ExerciseCreateInput = z.infer<typeof exerciseCreateInputSchema>;

export const exerciseCreateInputFormSchema = exerciseBaseSchema
  .extend({
    difficulty: z.enum(Difficulty).nullable(),
    bodyPart: z.enum(BodyPart).nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.difficulty) {
      ctx.addIssue({
        code: "invalid_value",
        values: Object.values(Difficulty),
        path: ["difficulty"],
      });
    }
    if (!data.bodyPart) {
      ctx.addIssue({
        code: "invalid_value",
        values: Object.values(BodyPart),
        path: ["bodyPart"],
      });
    }
  });
export type ExerciseCreateInputForm = z.infer<typeof exerciseCreateInputFormSchema>;

export const exerciseCreateOutputSchema = exerciseBaseWithIdSchema;
