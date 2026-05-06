import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const composeFile = resolve(repoRoot, "docker-compose.playwright.yml");

const DATABASE_URL =
  process.env.PLAYWRIGHT_DATABASE_URL ??
  "postgresql://pwuser:pwpassword@localhost:5433/fitmaster_playwright?schema=public";

function run(cmd: string, extraEnv: Record<string, string> = {}) {
  execSync(cmd, {
    cwd: repoRoot,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
}

export default async function globalSetup() {
  // Start dedicated DB for Playwright.
  run(`docker compose -p fitmaster-playwright -f "${composeFile}" up -d --wait`);

  // Container uses tmpfs, so DB is always empty here. Apply all migrations.
  run(`pnpm --filter @repo/db exec prisma migrate deploy`, {
    DATABASE_URL,
  });
}

