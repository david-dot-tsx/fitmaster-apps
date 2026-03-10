import z from "zod";

import { leaderboardEntrySchema } from "./shared.schema";
import { idSchema } from "../../utils/common-types";

export const leaderboardListInputSchema = z.object({
  cursor: idSchema.optional(),
  limit: z.number().int().positive().max(100).default(25),
});
export type LeaderboardListInput = z.infer<typeof leaderboardListInputSchema>;

export const leaderboardListOutputSchema = z.array(leaderboardEntrySchema);
export type LeaderboardListOutput = z.infer<typeof leaderboardListOutputSchema>;
