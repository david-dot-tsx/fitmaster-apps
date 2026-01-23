import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const createValidateEnv = () => {
  return createEnv({
    clientPrefix: "EXPO_PUBLIC_",
    client: envSchema.shape,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    onValidationError: (issues) => {
      issues.forEach((issue) => {
        console.error("❌ Invalid environment variables:", issue.path, issue.message);
      });
      throw new Error("Invalid environment variables");
    },
  });
};

export const env = createValidateEnv();
