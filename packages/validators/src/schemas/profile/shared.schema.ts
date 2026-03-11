import z from "zod";

import { Gender, type Gender as GenderType } from "@repo/db/types";

export const profileBaseSchema = z.object({
  bio: z.string().nullable(),
  nickname: z.string().min(3).max(20),
  firstName: z.string().min(2).max(20).nullable(),
  lastName: z.string().min(2).max(20).nullable(),
  birthDate: z.date(),
  gender: z.enum(Gender),
  imageUrl: z.string().nullable(),
});
export type ProfileBase = z.infer<typeof profileBaseSchema>;

export const customerProfileBaseSchema = z.object({
  height: z.number().int(),
  weight: z.number().int(),
  goal: z.string().nullable(),
});
export type CustomerProfileBase = z.infer<typeof customerProfileBaseSchema>;

export const customerProfileDetailedSchema = profileBaseSchema.extend({
  userId: z.string(),
  customerProfile: customerProfileBaseSchema,
});

export { Gender, GenderType };
