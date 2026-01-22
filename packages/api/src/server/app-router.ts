import { router } from "./trpc";
import { user } from "./routers/user";

export const appRouter = router({
  user: user,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
