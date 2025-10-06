// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for RGBW Control App
 * Tests cross-browser compatibility (Chrome, Firefox, Safari)
 */
module.exports = defineConfig({
  testDir: './',
  fullyParallel: false, // Run tests sequentially for camera access
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid camera conflicts
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        permissions: ['camera'],
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        permissions: ['camera'],
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        permissions: ['camera'],
      },
    },
  ],

  // Start Spring Boot app before tests
  webServer: {
    command: 'cd ../.. && mvn spring-boot:run',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for Maven to start
  },
});
