import z from "zod";

import { credentialsSchema } from "../../schemas/shared.schema";

export const authTokensSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

/**
 * Login
 */
export const authLoginInputSchema = credentialsSchema;
export type AuthLoginInput = z.infer<typeof authLoginInputSchema>;

export const authLoginOutputSchema = authTokensSchema;
export type AuthLoginOutput = z.infer<typeof authLoginOutputSchema>;

/**
 * Refresh Token
 */
export const authRefreshTokenInputSchema = z.object({
  refreshToken: z.string(),
});
export type AuthRefreshTokenInput = z.infer<typeof authRefreshTokenInputSchema>;

export const authRefreshTokenOutputSchema = authTokensSchema;
export type AuthRefreshTokenOutput = z.infer<typeof authRefreshTokenOutputSchema>;

/**
 * Logout
 */
export const authLogoutInputSchema = z.object({
  refreshToken: z.string(),
});
export type AuthLogoutInput = z.infer<typeof authLogoutInputSchema>;

export const authLogoutOutputSchema = z.void();
export type AuthLogoutOutput = z.infer<typeof authLogoutOutputSchema>;
