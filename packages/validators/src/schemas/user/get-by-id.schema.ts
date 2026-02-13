import type z from "zod";

import { userBaseSchema } from "./shared.schema";
import { withIdSchema } from "../../utils/objects";

export const userGetByIdInputSchema = withIdSchema;
export type UserGetByIdInput = z.infer<typeof userGetByIdInputSchema>;

export const userGetByIdOutputSchema = userBaseSchema;
export type UserGetByIdOutput = z.infer<typeof userGetByIdOutputSchema>;
