import z from "zod";

import { Gender, profileBaseSchema, customerProfileBaseSchema } from "./shared.schema";

export const customerProfileCreateInputSchema = z
  .object()
  .extend(profileBaseSchema.shape)
  .extend(customerProfileBaseSchema.shape);

export type CustomerProfileCreateInput = z.infer<typeof customerProfileCreateInputSchema>;
export type CustomerProfileCreateInputKey = keyof CustomerProfileCreateInput;

export const customerProfileCreateOutputSchema = profileBaseSchema.extend({
  userId: z.string(),
  customerProfile: customerProfileBaseSchema.nullable(),
});
export type CustomerProfileCreateOutput = z.infer<typeof customerProfileCreateOutputSchema>;

export const customerProfileCreateFormSchema = z
  .object()
  .extend(profileBaseSchema.shape)
  .extend(customerProfileBaseSchema.shape)
  .extend({
    gender: z.enum(Gender).nullable(),
  })
  .refine((data) => data.gender !== null, {
    message: "Gender is required",
    path: ["gender"],
  });
