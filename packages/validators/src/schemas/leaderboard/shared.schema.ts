import z from "zod";

import { idSchema } from "../../utils/common-types";

export const leaderboardEntrySchema = z.object({
  customerProfileId: idSchema,
  nickname: z.string(),
  points: z.number().int().nonnegative(),
  position: z.number().int().positive(),
});
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
