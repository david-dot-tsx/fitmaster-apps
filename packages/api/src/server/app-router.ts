import { router } from "./trpc";
import { user } from "../routers/user/user.route";
import { auth } from "../routers/auth/auth.route";
import { exercise } from "../routers/exercise/exercise.route";
import { training } from "../routers/training/training.route";
import { trainingDay } from "../routers/trainingDay/training-day.route";
import { profile } from "../routers/profile/profile.route";
import { leaderboard } from "../routers/leaderboard/leaderboard.route";

export const appRouter = router({
  user,
  auth,
  profile,
  exercise,
  training,
  trainingDay,
  leaderboard,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
