import { defineConfig, devices } from "@playwright/test";

/**
 * Hero / island scripts exercise real routing (rewrites, /hubfs, /__mirror).
 * Prefer `reuseExistingServer` locally so repeated runs are faster.
 * Compare clone vs www.endava.com headings: `E2E_LIVE_COMPARE=1 npm run test:e2e -- e2e/capabilities-parity-live.spec.ts`
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 40_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1"
      ? undefined
      : {
          command: "npm run build && npm run start -- -p 3000",
          url: "http://127.0.0.1:3000",
          reuseExistingServer: process.env.E2E_REUSE_SERVER === "1",
          timeout: 180_000,
        },
});
