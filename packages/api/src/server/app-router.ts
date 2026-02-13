import { router } from "./trpc";
import { user } from "../routers/user/user.route";
import { auth } from "../routers/auth/auth.route";
import { exercise } from "../routers/exercise/exercise.route";
import { training } from "../routers/training/training.route";

export const appRouter = router({
  user,
  auth,
  exercise,
  training,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
