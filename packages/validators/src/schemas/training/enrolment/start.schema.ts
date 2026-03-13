import z from "zod";

export const startTrainingEnrolmentInputSchema = z.object({});
export type StartTrainingEnrolmentInput = z.infer<typeof startTrainingEnrolmentInputSchema>;

export const startTrainingEnrolmentOutputSchema = z.object({
  res: z.string(),
});
export type StartTrainingEnrolmentOutput = z.infer<typeof startTrainingEnrolmentOutputSchema>;
