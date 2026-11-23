import { defineConfig, devices } from '@playwright/test';

// Optional local overrides; CI passes env vars directly.
try { process.loadEnvFile(); } catch { /* no .env file */ }

const UI_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: isCI ? [['html', { open: 'never' }], ['github'], ['list']] : [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // saucedemo marks elements with data-test="…"; getByTestId() reads it
    testIdAttribute: 'data-test',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { baseURL: UI_URL } },
    {
      name: 'ui',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: UI_URL, storageState: 'playwright/.auth/standard-user.json' },
    },
    { name: 'api', testDir: './tests/api', use: { baseURL: API_URL, extraHTTPHeaders: { Accept: 'application/json' } } },
  ],
});
