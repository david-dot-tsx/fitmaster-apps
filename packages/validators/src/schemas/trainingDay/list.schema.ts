import z from "zod";

import { idSchema } from "../../utils/common-types";
import { trainingDayDetailedSchema } from "./shared.schema";

export const trainingDayListInputSchema = z.object({
  trainingId: idSchema,
});

export const trainingDayListOutputSchema = z.array(trainingDayDetailedSchema);
export type TrainingDayListOutput = z.infer<typeof trainingDayListOutputSchema>;
