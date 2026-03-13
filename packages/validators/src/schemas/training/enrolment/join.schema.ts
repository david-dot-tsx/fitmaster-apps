import z from "zod";

import { idSchema } from "../../../utils/common-types";

export const joinTrainingEnrolmentInputSchema = z.object({
  trainingId: idSchema,
});
export type JoinTrainingEnrolmentInput = z.infer<typeof joinTrainingEnrolmentInputSchema>;

export const joinTrainingEnrolmentOutputSchema = z.object({
  id: idSchema,
});
export type JoinTrainingEnrolmentOutput = z.infer<typeof joinTrainingEnrolmentOutputSchema>;
