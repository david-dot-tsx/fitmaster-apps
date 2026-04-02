import z from "zod";

import { trainingSchema } from "./shared.schema";
import { withIdSchema } from "../../utils/objects";
import { exerciseBaseWithIdSchema } from "../exercise/shared.schema";
import { trainingSessionSchema, baseTrainingSessionStatsSchema } from "./session/shared.schema";

export const trainingGetByIdCustomerInputSchema = withIdSchema;
export type TrainingGetByIdCustomerInput = z.infer<typeof trainingGetByIdCustomerInputSchema>;

export const trainingGetByIdCustomerSessionSchema = trainingSessionSchema.and(
  z.object({
    stats: baseTrainingSessionStatsSchema,
  }),
);

export const trainingGetByIdCustomerOutputSchema = trainingSchema.and(
  z.object({
    trainingSessions: z.array(trainingGetByIdCustomerSessionSchema),
    daysAmount: z.number().int().nonnegative(),
    exercises: z.array(exerciseBaseWithIdSchema),
  }),
);
export type TrainingGetByIdCustomerOutput = z.infer<typeof trainingGetByIdCustomerOutputSchema>;
