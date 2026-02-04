import { router } from "./trpc";
import { user } from "../routers/user/user.route";
import { auth } from "../routers/auth/auth.route";

export const appRouter = router({
  user,
  auth,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
