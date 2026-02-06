import z from "zod";

import { authTokensSchema } from "./shared.schema";

export const authLogoutInputSchema = authTokensSchema.pick({ refreshToken: true });
export type AuthLogoutInput = z.infer<typeof authLogoutInputSchema>;

export const authLogoutOutputSchema = z.void();
export type AuthLogoutOutput = z.infer<typeof authLogoutOutputSchema>;
