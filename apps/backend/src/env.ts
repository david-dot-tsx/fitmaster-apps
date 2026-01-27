import "dotenv/config";

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),

    // Server configuration
    PORT: z.coerce.number(),
    HOST: z.string(),

    // Environment
    NODE_ENV: z.enum(["development", "production", "test"]),

    // CORS
    CORS_ORIGIN: z.string(),

    // JWT
    JWT_SECRET: z.string(),
    JWT_TOKEN_EXPIRES_IN: z.string(),
    JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number(),

    // TRPC
    TRPC_PATH: z.string(),

    // SWAGGER
    SWAGGER_PATH: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
