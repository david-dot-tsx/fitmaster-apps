import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_API_TRPC_PATH: z.string().startsWith("/"),
});

export const createValidateEnv = () => {
  return createEnv({
    clientPrefix: "EXPO_PUBLIC_",
    client: envSchema.shape,
    runtimeEnv: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_API_TRPC_PATH: process.env.EXPO_PUBLIC_API_TRPC_PATH,
    },
    emptyStringAsUndefined: true,
    onValidationError: (issues) => {
      issues.forEach((issue) => {
        console.error("❌ Invalid environment variables:", issue.path, issue.message);
      });
      throw new Error("Invalid environment variables", { cause: issues });
    },
  });
};

export const env = createValidateEnv();
