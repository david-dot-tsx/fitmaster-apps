import z from "zod";

import { leaderboardEntrySchema } from "./shared.schema";

export const leaderboardGetPositionInputSchema = z.object({
  nickname: z.string().min(1),
});
export type LeaderboardGetPositionInput = z.infer<typeof leaderboardGetPositionInputSchema>;

export const leaderboardGetPositionOutputSchema = leaderboardEntrySchema;
export type LeaderboardGetPositionOutput = z.infer<typeof leaderboardGetPositionOutputSchema>;
