import z from "zod";

import { trainingSchema } from "./shared.schema";
import { withIdSchema } from "../../utils/objects";
import { exerciseBaseWithIdSchema } from "../exercise/shared.schema";

export const trainingGetByIdCustomerInputSchema = withIdSchema;
export type TrainingGetByIdCustomerInput = z.infer<typeof trainingGetByIdCustomerInputSchema>;

export const trainingGetByIdCustomerOutputSchema = trainingSchema.and(
  z.object({
    daysAmount: z.number().int().nonnegative(),
    exercises: z.array(exerciseBaseWithIdSchema),
  }),
);
export type TrainingGetByIdCustomerOutput = z.infer<typeof trainingGetByIdCustomerOutputSchema>;
