import z from "zod";

import { CustomerProgressTrainingStatus } from "@repo/db/types";

import { idSchema } from "../../../utils/common-types";
import { withTimestampsSchema } from "../../../utils/objects";

export const progressCustomerTrainingSchema = z
  .object({
    id: idSchema,
    trainingId: idSchema,
    customerProfileId: idSchema,
    status: z.enum(CustomerProgressTrainingStatus),
    deletedAt: z.date().nullable(),
  })
  .and(withTimestampsSchema);

export const myTrainingsEnrolmentOutputSchema = z.array(progressCustomerTrainingSchema);
export type MyTrainingsEnrolmentOutput = z.infer<typeof myTrainingsEnrolmentOutputSchema>;
