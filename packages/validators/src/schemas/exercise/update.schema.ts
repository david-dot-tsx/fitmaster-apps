import { z } from "zod";

import { BodyPart, Difficulty, exerciseBaseWithIdSchema } from "./shared.schema";

export const exerciseUpdateInputSchema = exerciseBaseWithIdSchema;
export type ExerciseUpdateInput = z.infer<typeof exerciseUpdateInputSchema>;

export const exerciseUpdateInputFormSchema = exerciseBaseWithIdSchema
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
export type ExerciseUpdateInputForm = z.infer<typeof exerciseUpdateInputFormSchema>;

export const exerciseUpdateOutputSchema = exerciseBaseWithIdSchema;
export type ExerciseUpdateOutput = z.infer<typeof exerciseUpdateOutputSchema>;
