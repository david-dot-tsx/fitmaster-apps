import z from "zod";

import { userBaseSchema } from "./shared.schema";

export const userGetByIdInputSchema = z.object({
  id: z.string(),
});
export type UserGetByIdInput = z.infer<typeof userGetByIdInputSchema>;
export const userGetByIdOutputSchema = userBaseSchema;
export type UserGetByIdOutput = z.infer<typeof userGetByIdOutputSchema>;
