import z from "zod";

import { TrainingStatus, type TrainingStatus as TrainingStatusType } from "@repo/db/types";

import { withIdSchema, withTimestampsSchema } from "../../utils/objects";

export const trainingBaseSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
});
export type TrainingBase = z.infer<typeof trainingBaseSchema>;

export const trainingSchema = z
  .object({
    status: z.enum(TrainingStatus),
  })
  .and(trainingBaseSchema)
  .and(withIdSchema)
  .and(withTimestampsSchema);

export type Training = z.infer<typeof trainingSchema>;

export { TrainingStatus, type TrainingStatusType };
