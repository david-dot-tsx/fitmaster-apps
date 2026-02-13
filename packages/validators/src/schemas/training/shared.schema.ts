import z from "zod";

import { TrainingStatus } from "@repo/db/types";

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
  .extend(trainingBaseSchema.shape)
  .extend(withIdSchema.shape)
  .extend(withTimestampsSchema.shape);

export type Training = z.infer<typeof trainingSchema>;

export { TrainingStatus };
