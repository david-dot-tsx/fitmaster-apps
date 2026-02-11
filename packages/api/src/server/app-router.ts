import { router } from "./trpc";
import { user } from "../routers/user/user.route";
import { auth } from "../routers/auth/auth.route";
import { exercise } from "../routers/exercise/exercise.route";

export const appRouter = router({
  user,
  auth,
  exercise,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
