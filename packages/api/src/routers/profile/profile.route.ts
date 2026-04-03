import { TRPCError } from "@trpc/server";
import { pick } from "remeda";

import {
  customerProfileCreateInputSchema,
  customerProfileCreateOutputSchema,
  customerProfileGetInputSchema,
  customerProfileGetOutputSchema,
} from "@repo/validators";

import { customerProcedure, protectedProcedure, router } from "../../server/trpc";
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
        select: { id: true },
      });

      if (existing) {
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
          userId: true,
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

      return profile;
    }),

  getCustomerProfile: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/profile.getCustomerProfile",
        tags: ["CustomerProfile"],
      },
    })
    .input(customerProfileGetInputSchema)
    .output(customerProfileGetOutputSchema)
    .query(async ({ input, ctx }) => {
      const select = {
        userId: true,
        bio: true,
        nickname: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        gender: true,
        imageUrl: true,
        customerProfile: {
          select: {
            height: true,
            weight: true,
            goal: true,
          },
        },
      } as const;

      const profile = await ctx.prisma.profile.findFirst({
        where: {
          ...("userId" in input ? { userId: input.userId } : {}),
          ...("email" in input ? { user: { email: input.email } } : {}),
          ...("nickname" in input ? { nickname: input.nickname } : {}),
        },
        select,
      });

      return customerProfileGetOutputSchema.parse(profile);
    }),
});
