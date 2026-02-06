import z from "zod";

import { userBaseSchema } from "./shared.schema";

export const userMeOutputSchema = userBaseSchema.extend({
  profile: z
    .object({
      id: z.string(),
      nickname: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .nullable(),
});
export type UserMeOutput = z.infer<typeof userMeOutputSchema>;
