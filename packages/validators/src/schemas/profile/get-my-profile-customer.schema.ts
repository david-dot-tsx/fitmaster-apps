import type z from "zod";

import { customerProfileDetailedSchema } from "./shared.schema";

export const customerProfileGetOutputSchema = customerProfileDetailedSchema;
export type CustomerProfileGetOutput = z.infer<typeof customerProfileGetOutputSchema>;
