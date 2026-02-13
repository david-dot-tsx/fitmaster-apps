import z from "zod";

import { TrainingStatus } from "@repo/db/types";

import { trainingSchema } from "./shared.schema";

export const trainingListStaffInputSchema = z.object({
  status: z.array(z.enum(TrainingStatus)).optional(),
});
export type TrainingListStaffInput = z.infer<typeof trainingListStaffInputSchema>;

export const trainingListStaffOutputSchema = z.array(trainingSchema);
export type TrainingListStaffOutput = z.infer<typeof trainingListStaffOutputSchema>;
