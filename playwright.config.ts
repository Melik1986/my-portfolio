import { defineConfig, devices } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Создаем директории для отчетов если их нет
const reportsDir = join(process.cwd(), 'test-reports');
const resultsDir = join(process.cwd(), 'test-results');

[reportsDir, resultsDir].forEach(dir => {
  if (!existsSync(dir)) {
    try {
      mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.warn(`Warning: Could not create directory ${dir}:`, error);
    }
  }
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Конфигурируемые параметры
  timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000', 10),
  
  reporter: [
    ['html', { outputFolder: 'test-reports/html' }],
    ['json', { outputFile: 'test-reports/results.json' }],
    ['junit', { outputFile: 'test-reports/junit.xml' }],
  ],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: process.env.CI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Настройки браузера
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Таймауты
    actionTimeout: parseInt(process.env.PLAYWRIGHT_ACTION_TIMEOUT || '5000', 10),
    navigationTimeout: parseInt(process.env.PLAYWRIGHT_NAV_TIMEOUT || '30000', 10),
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-background-timer-throttling',
            '--force-prefers-reduced-motion=no-preference',
          ],
        },
      },
    },
  ],
  
  globalSetup: require.resolve('./tests/global-setup'),
  globalTeardown: require.resolve('./tests/global-teardown'),
  
  outputDir: 'test-results/',
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND || 'npm run dev',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: parseInt(process.env.PLAYWRIGHT_SERVER_TIMEOUT || '120000', 10),
  },
});
