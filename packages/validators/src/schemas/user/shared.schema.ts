import z from "zod";

import { Role, type User as UserType } from "@repo/db/types";

export const userBaseSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(Role),
  createdAt: z.date(),
});
export type UserBase = z.infer<typeof userBaseSchema>;

export { type UserType };
