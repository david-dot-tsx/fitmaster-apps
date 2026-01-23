import "dotenv/config";
import { createValidateEnv } from "../src/env";

createValidateEnv();
// eslint-disable-next-line no-console
console.info("✅ Environment variables are valid");
