import { TRPCError } from "@trpc/server";
import { pick } from "remeda";

import {
  customerProfileCreateInputSchema,
  customerProfileCreateOutputSchema,
  customerProfileGetOutputSchema,
} from "@repo/validators";

import { customerProcedure, router } from "../../server/trpc";
import { API_PROCEDURE_ERRORS } from "../../consts/api-procedure-errors";

export const profile = router({
  createCustomerProfile: customerProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/profile.createCustomerProfile",
        tags: ["CustomerProfile"],
      },
    })
    .input(customerProfileCreateInputSchema)
    .output(customerProfileCreateOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.sessionUser.id },
        select: { id: true, deletedAt: true },
      });

      if (existing && !existing.deletedAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: API_PROCEDURE_ERRORS.CONFLICT,
        });
      }

      const profile = await ctx.prisma.profile.create({
        data: {
          userId: ctx.sessionUser.id,
          ...pick(input, [
            "bio",
            "nickname",
            "firstName",
            "lastName",
            "birthDate",
            "gender",
            "imageUrl",
          ]),
          customerProfile: {
            create: {
              ...pick(input, ["height", "weight", "goal"]),
            },
          },
        },
        select: {
          id: true,
          bio: true,
          nickname: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          gender: true,
          imageUrl: true,
          customerProfile: {
            select: {
              id: true,
              height: true,
              weight: true,
              goal: true,
            },
          },
        },
      });

      return customerProfileCreateOutputSchema.parse(profile);
    }),

  getCustomerMyProfile: customerProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/profile.getCustomerMyProfile",
        tags: ["CustomerProfile"],
      },
    })
    .output(customerProfileGetOutputSchema)
    .query(async ({ ctx }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.sessionUser.id },
        select: {
          id: true,
          bio: true,
          nickname: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          gender: true,
          imageUrl: true,
          customerProfile: {
            select: {
              id: true,
              height: true,
              weight: true,
              goal: true,
            },
          },
        },
      });

      return customerProfileGetOutputSchema.parse(profile);
    }),
});
