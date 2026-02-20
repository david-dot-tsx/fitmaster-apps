import z from "zod";

import { Role, TrainingStatus } from "@repo/db/types";

import { idSchema } from "../../utils/common-types";
import { trainingSchema } from "./shared.schema";

export const TRAINER_TRAINING_STATUS_FLOW: Record<TrainingStatus, TrainingStatus[]> = {
  [TrainingStatus.DRAFT]: [TrainingStatus.READY_TO_PUBLISH],
  [TrainingStatus.READY_TO_PUBLISH]: [TrainingStatus.DRAFT, TrainingStatus.PUBLISHED],
  [TrainingStatus.PUBLISHED]: [
    TrainingStatus.DRAFT,
    TrainingStatus.HIDDEN,
    TrainingStatus.DISABLED,
  ],
  [TrainingStatus.DISABLED]: [TrainingStatus.PUBLISHED, TrainingStatus.HIDDEN],
  [TrainingStatus.HIDDEN]: [],
};

export const canChangeStatus = (from: TrainingStatus, to: TrainingStatus, userRole: Role) => {
  if (userRole === Role.ADMIN) {
    return true;
  }

  if (userRole === Role.TRAINER) {
    return TRAINER_TRAINING_STATUS_FLOW[from].includes(to);
  }

  return false;
};

export const trainingUpdateStatusInputSchema = z.object({
  trainingId: idSchema,
  status: z.enum(TrainingStatus),
});

export const trainingUpdateStatusOutputSchema = trainingSchema;
