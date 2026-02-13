import type z from "zod";

import { trainingSchema } from "./shared.schema";
import { withIdSchema } from "../../utils/objects";

export const trainingGetByIdInputSchema = withIdSchema;

export type TrainingGetByIdInput = z.infer<typeof trainingGetByIdInputSchema>;

export const trainingGetByIdOutputSchema = trainingSchema;
export type TrainingGetByIdOutput = z.infer<typeof trainingGetByIdOutputSchema>;
