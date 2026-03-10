import type z from "zod";

import { leaderboardEntrySchema } from "./shared.schema";

export const leaderboardGetMyPositionOutputSchema = leaderboardEntrySchema;
export type LeaderboardGetMyPositionOutput = z.infer<typeof leaderboardGetMyPositionOutputSchema>;
