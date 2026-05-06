import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const composeFile = resolve(repoRoot, "docker-compose.playwright.yml");

export default async function globalTeardown() {
  execSync(`docker compose -p fitmaster-playwright -f "${composeFile}" down -v`, {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

