import z from "zod";

import { idSchema } from "../../../utils/common-types";

export const startTrainingEnrolmentInputSchema = z.object({ id: idSchema });
export type StartTrainingEnrolmentInput = z.infer<typeof startTrainingEnrolmentInputSchema>;

export const startTrainingEnrolmentOutputSchema = z.object({
  res: z.string(),
});
export type StartTrainingEnrolmentOutput = z.infer<typeof startTrainingEnrolmentOutputSchema>;
