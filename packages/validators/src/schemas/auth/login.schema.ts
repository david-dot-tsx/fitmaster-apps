import type z from "zod";

import { authTokensSchema, credentialsSchema } from "./shared.schema";

export const authLoginInputSchema = credentialsSchema;
export type AuthLoginInput = z.infer<typeof authLoginInputSchema>;

export const authLoginOutputSchema = authTokensSchema;
export type AuthLoginOutput = z.infer<typeof authLoginOutputSchema>;
