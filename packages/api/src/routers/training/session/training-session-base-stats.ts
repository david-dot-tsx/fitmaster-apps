import { endOfDay, startOfDay } from "date-fns";

import { type PrismaClient } from "@repo/db/prisma";
import { TrainingDaySessionStatus } from "@repo/db/types";

/**
 * Same "current day" resolution as startDay / myTrainings (active or completed-today).
 */
export async function getBaseTrainingSessionStats(
  prisma: PrismaClient,
  params: { trainingSessionId: string; totalDays: number },
) {
  const now = new Date();
  const existingProgressDay = await prisma.trainingDaySession.findFirst({
    orderBy: [{ trainingDay: { order: "asc" } }],
    where: {
      trainingSessionId: params.trainingSessionId,
      OR: [
        {
          status: {
            in: [TrainingDaySessionStatus.IN_PROGRESS, TrainingDaySessionStatus.NOT_STARTED],
          },
        },
        {
          status: TrainingDaySessionStatus.COMPLETED,
          finishedAt: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
        },
      ],
    },
    include: {
      trainingDay: true,
    },
  });

  return {
    currentDay: existingProgressDay?.trainingDay?.order ?? 1,
    totalDays: params.totalDays,
    hasUserCompletedThisDay: existingProgressDay?.status === TrainingDaySessionStatus.COMPLETED,
  };
}
