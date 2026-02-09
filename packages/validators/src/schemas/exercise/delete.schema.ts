import z from "zod";

export const exerciseDeleteInputSchema = z.object({
  id: z.uuid(),
});
export type ExerciseDeleteInput = z.infer<typeof exerciseDeleteInputSchema>;

export const exerciseDeleteOutputSchema = z.object({
  id: z.uuid(),
});
export type ExerciseDeleteOutput = z.infer<typeof exerciseDeleteOutputSchema>;
