import z from "zod";

import { Role, type Role as RoleType } from "@repo/db/types";
export const credentialsSchema = z.object({
  email: z.email().nonempty().max(64),
  password: z.string().nonempty().min(8).max(64),
});
export type Credentials = z.infer<typeof credentialsSchema>;

export const authTokensSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;
export { Role, type RoleType };
