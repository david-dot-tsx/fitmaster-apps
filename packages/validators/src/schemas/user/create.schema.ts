import z from "zod";

import { credentialsSchema, Role } from "../auth/shared.schema";
import { userBaseSchema } from "./shared.schema";

export const userCreateInputSchema = credentialsSchema.extend({
  role: z.enum([Role.CUSTOMER, Role.TRAINER]).optional(),
});
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;

export const userCreateOutputSchema = userBaseSchema;
export type UserCreateOutput = z.infer<typeof userCreateOutputSchema>;

export const userCreateInputFormSchema = credentialsSchema
  .extend({
    passwordConfirmation: z.string().nonempty().min(8).max(64),
    role: z.enum([Role.CUSTOMER, Role.TRAINER]).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
export type UserCreateInputForm = z.infer<typeof userCreateInputFormSchema>;
