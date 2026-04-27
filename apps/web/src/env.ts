import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    // Cookie
    NODE_ENV: z.enum(["local", "development", "production", "test"]),
    COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS: z.coerce.number(),
    COOKIE_TOKEN_MAX_AGE_IN_SECONDS: z.coerce.number(),
    API_PROXY_TARGET_URL: z.url(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_API_TRPC_PATH: z.string().startsWith("/"),
  },
  /*
   * Specify what values should be validated by your schemas above.
   *
   * If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
   * For Next.js >= 13.4.4, you can use the experimental__runtimeEnv option and
   * only specify client-side variables.
   */
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_TRPC_PATH: process.env.NEXT_PUBLIC_API_TRPC_PATH,
    NODE_ENV: process.env.NODE_ENV,
    COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS: process.env.COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS,
    COOKIE_TOKEN_MAX_AGE_IN_SECONDS: process.env.COOKIE_TOKEN_MAX_AGE_IN_SECONDS,
    API_PROXY_TARGET_URL: process.env.API_PROXY_TARGET_URL,
  },
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
