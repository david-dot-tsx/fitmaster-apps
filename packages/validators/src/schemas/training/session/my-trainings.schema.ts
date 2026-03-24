import z from "zod";

import { CustomerProgressTrainingStatus } from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withTimestampsSchema } from "../../../utils/objects";
import { trainingSchema } from "../shared.schema";

export const trainingSessionSchema = z
  .object({
    id: idSchema,
    trainingId: idSchema,
    training: trainingSchema,
    customerProfileId: idSchema,
    status: z.enum(CustomerProgressTrainingStatus),
  })
  .and(withTimestampsSchema);

export const trainingSessionMyTrainingsOutputSchema = z.array(trainingSessionSchema);
export type TrainingSessionMyTrainingsOutput = z.infer<
  typeof trainingSessionMyTrainingsOutputSchema
>;
