import { TRPCError } from "@trpc/server";

import {
  joinTrainingEnrolmentInputSchema,
  joinTrainingEnrolmentOutputSchema,
  myTrainingsEnrolmentOutputSchema,
  startTrainingEnrolmentInputSchema,
  startTrainingEnrolmentOutputSchema,
} from "@repo/validators";

import { router, customerProcedure } from "../../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../../consts/api-procedure-errors";

export const trainingEnrolment = router({
  join: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.enrolment.join",
        tags: ["Training:Enrolment"],
      },
    })
    .input(joinTrainingEnrolmentInputSchema)
    .output(joinTrainingEnrolmentOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: {
          profile: {
            userId: ctx.sessionUser.id,
          },
        },
      });

      if (!customerProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: API_PROCEDURE_ERRORS.NOT_FOUND });
      }
      const trainingEnrollment = await ctx.prisma.progressCustomerTraining.create({
        data: {
          customerProfileId: customerProfile.id,
          trainingId: input.trainingId,
        },
      });

      return { id: trainingEnrollment.id };
    }),
  myTrainings: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/training.enrolment.myTrainings",
        tags: ["Training:Enrolment"],
      },
    })
    .output(myTrainingsEnrolmentOutputSchema)
    .query(async ({ ctx }) => {
      const customerProfile = await ctx.prisma.customerProfile.findFirst({
        where: {
          profile: {
            userId: ctx.sessionUser.id,
          },
        },
      });
      if (!customerProfile) {
        return [];
      }

      const enrolledTrainings = await ctx.prisma.progressCustomerTraining.findMany({
        where: {
          customerProfileId: customerProfile.id,
        },
      });

      return enrolledTrainings;
    }),

  start: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/training.enrolment.start",
        tags: ["Training:Enrolment"],
      },
    })
    .input(startTrainingEnrolmentInputSchema)
    .output(startTrainingEnrolmentOutputSchema)
    .mutation(async () => {
      // TODO:
      return { res: "ok" };
    }),
});
