import { defineConfig, devices } from '@playwright/test';

const WEB_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://127.0.0.1:3100';
const BACKEND_URL = process.env.PLAYWRIGHT_BACKEND_URL ?? 'http://127.0.0.1:3101';
const DATABASE_URL =
  process.env.PLAYWRIGHT_DATABASE_URL ??
  'postgresql://pwuser:pwpassword@localhost:5433/fitmaster_playwright?schema=public';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests-e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: WEB_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  globalSetup: './tests-e2e/global-setup.ts',
  globalTeardown: './tests-e2e/global-teardown.ts',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: [
    {
      command: 'pnpm --filter backend dev',
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        DATABASE_URL,
        HOST: '127.0.0.1',
        PORT: '3101',
        NODE_ENV: 'test',
        CORS_ORIGIN: WEB_URL,
        JWT_SECRET: 'playwright-jwt-secret',
        JWT_TOKEN_EXPIRES_IN_SECONDS: '3600',
        JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS: '7200',
        COOKIE_SECRET: 'playwright-cookie-secret',
        COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS: '7776000',
        COOKIE_TOKEN_MAX_AGE_IN_SECONDS: '900',
        TRPC_PATH: 'trpc',
        SWAGGER_PATH: 'swagger',
      },
    },
    {
      command: 'rm -rf .next && pnpm --filter web exec next dev --port 3100',
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        NEXT_DISABLE_TURBOPACK: '1',
        NEXT_TELEMETRY_DISABLED: '1',
        NEXT_PUBLIC_API_URL: BACKEND_URL,
        NEXT_PUBLIC_API_TRPC_PATH: '/trpc',
        API_PROXY_TARGET_URL: BACKEND_URL,
        COOKIE_REFRESH_TOKEN_MAX_AGE_IN_SECONDS: '7776000',
        COOKIE_TOKEN_MAX_AGE_IN_SECONDS: '900',
      },
    },
  ],
});
