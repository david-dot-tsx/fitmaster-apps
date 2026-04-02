import z from "zod";

import { TrainingStatus } from "@repo/db/types";

import { idSchema } from "../../utils/common-types";
import { trainingSchema } from "./shared.schema";
import { trainingSessionSchema, baseTrainingSessionStatsSchema } from "./session/shared.schema";

export const trainingListStaffInputSchema = z.object({
  status: z.array(z.enum(TrainingStatus)).optional(),
});
export type TrainingListStaffInput = z.infer<typeof trainingListStaffInputSchema>;

export const trainingListStaffOutputSchema = z.array(trainingSchema);
export type TrainingListStaffOutput = z.infer<typeof trainingListStaffOutputSchema>;

export const trainingListPublishedInputSchema = z.object({
  cursor: idSchema.optional(),
  limit: z.number().int().positive().max(100).default(25),
});
export type TrainingListPublishedInput = z.infer<typeof trainingListPublishedInputSchema>;

export const trainingListPublishedSessionItemSchema = trainingSessionSchema.and(
  z.object({
    stats: baseTrainingSessionStatsSchema,
  }),
);

export const trainingListPublishedItemSchema = trainingSchema.and(
  z.object({
    totalDays: z.number().int().nonnegative(),
    trainingSessions: z.array(trainingListPublishedSessionItemSchema),
  }),
);
export type TrainingListPublishedItem = z.infer<typeof trainingListPublishedItemSchema>;

export const trainingListPublishedOutputSchema = z.array(trainingListPublishedItemSchema);
export type TrainingListPublishedOutput = z.infer<typeof trainingListPublishedOutputSchema>;
