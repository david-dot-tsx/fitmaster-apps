import z from "zod";

import { idSchema } from "../../utils/common-types";
import { customerProfileDetailedSchema } from "./shared.schema";

export const customerProfileGetInputSchema = z.object({
  userId: idSchema.optional(),
  email: z.string().email().optional(),
  nickname: z.string().min(3).max(20).optional(),
  searchPhrase: z.string().optional(),
});
export type CustomerProfileGetInput = z.infer<typeof customerProfileGetInputSchema>;

export const customerProfileGetOutputSchema = customerProfileDetailedSchema;
export type CustomerProfileGetOutput = z.infer<typeof customerProfileGetOutputSchema>;
