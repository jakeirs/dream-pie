import { defineConfig } from '@playwright/test'

/**
 * Simplified Playwright config - Chrome only, fastest possible setup
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially for simplicity
  retries: 0, // No retries for faster testing
  workers: 1, // Single worker for speed
  reporter: 'line', // Simple line reporter, no HTML

  use: {
    baseURL: 'http://localhost:8081',
    headless: false, // Show browser for visual verification
    screenshot: 'only-on-failure',
    trace: 'off', // Disable trace for speed
    video: 'off', // Disable video for speed
  },

  /* Single Chrome project only */
  projects: [
    {
      name: 'chrome',
      use: {
        channel: 'chrome', // Use installed Google Chrome
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /* Fast timeouts */
  timeout: 10 * 1000, // 10 seconds max per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },
})
