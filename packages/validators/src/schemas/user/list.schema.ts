import z from "zod";

import { userBaseSchema } from "./shared.schema";

export const userListOutputSchema = z.array(userBaseSchema);
export type UserListOutput = z.infer<typeof userListOutputSchema>;
