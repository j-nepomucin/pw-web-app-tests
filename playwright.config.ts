import { defineConfig, devices } from '@playwright/test';
import { OrtoniReportConfig } from 'ortoni-report';
import * as os from "os";

const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? "never" : "always",
  folderPath: "ortoni-report",
  filename: "index.html",
  title: "Sanity+Smoke+Regression Test Report",
  showProject: false,
  projectName: "QA Practice Web App",
  testType: "Sanity+Smoke+Regression Test",
  authorName: os.userInfo().username,
  base64Image: false,
  stdIO: true,
  meta: {
    "Website": "QA Practice",
    description: "QA Practice Web App Playwright Automated Tests",
    date: new Date().toISOString(),
    time: new Date().toTimeString(),
    platform: os.type(),
  },
};

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  // /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [["ortoni-report", reportConfig]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.qa-practice.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

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
  ],

});
