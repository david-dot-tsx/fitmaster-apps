import type z from "zod";

import { authTokensSchema } from "./shared.schema";

export const authRefreshTokenInputSchema = authTokensSchema.pick({ refreshToken: true });
export type AuthRefreshTokenInput = z.infer<typeof authRefreshTokenInputSchema>;

export const authRefreshTokenOutputSchema = authTokensSchema;
export type AuthRefreshTokenOutput = z.infer<typeof authRefreshTokenOutputSchema>;
