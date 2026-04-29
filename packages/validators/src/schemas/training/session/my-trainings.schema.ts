import z from "zod";

import { TrainingSessionStatus } from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withTimestampsSchema } from "../../../utils/objects";
import { trainingSchema } from "../shared.schema";
import { baseTrainingSessionStatsSchema } from "./shared.schema";

export const trainingSessionMyTrainingsItemSchema = z
  .object({
    id: idSchema,
    trainingId: idSchema,
    training: trainingSchema,
    customerProfileId: idSchema,
    status: z.enum(TrainingSessionStatus),
    stats: baseTrainingSessionStatsSchema,
  })
  .and(withTimestampsSchema);
export type TrainingSessionMyTrainingsItem = z.infer<typeof trainingSessionMyTrainingsItemSchema>;

export const trainingSessionMyTrainingsOutputSchema = z.array(trainingSessionMyTrainingsItemSchema);
export type TrainingSessionMyTrainingsOutput = z.infer<
  typeof trainingSessionMyTrainingsOutputSchema
>;
