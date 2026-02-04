import z from "zod";

import { credentialsSchema } from "../../schemas/shared.schema";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.date(),
});
export type User = z.infer<typeof userSchema>;

/**
 * Create User
 */
export const userCreateInputSchema = credentialsSchema;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
export const userCreateOutputSchema = userSchema;
export type UserCreateOutput = z.infer<typeof userCreateOutputSchema>;

/**
 * Get User by ID
 */
export const userGetByIdInputSchema = z.object({
  id: z.string(),
});
export type UserGetByIdInput = z.infer<typeof userGetByIdInputSchema>;
export const userGetByIdOutputSchema = userSchema;
export type UserGetByIdOutput = z.infer<typeof userGetByIdOutputSchema>;

/**
 * Me
 */
export const userMeOutputSchema = userSchema.extend({
  profile: z
    .object({
      id: z.string(),
      nickname: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .nullable(),
});
export type UserMeOutput = z.infer<typeof userMeOutputSchema>;

/**
 * List Users
 */
export const userListOutputSchema = z.array(userSchema);
export type UserListOutput = z.infer<typeof userListOutputSchema>;
