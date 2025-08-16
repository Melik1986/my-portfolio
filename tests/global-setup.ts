/**
 * Глобальная настройка для тестов анимаций
 * Выполняется один раз перед всеми тестами
 */

import { chromium } from '@playwright/test';
import type { FullConfig } from '@playwright/test';
import { mkdirSync, writeFileSync, appendFileSync, unlinkSync } from 'fs';
import { join } from 'path';

interface AnimationElement {
  tag: string;
  type: string;
  className: string;
  visible: boolean;
}

interface AnimationData {
  total: number;
  withAnimate: number;
  withAnimation: number;
  elements: AnimationElement[];
}

const createDirectories = (): { reportsDir: string; resultsDir: string } => {
  const reportsDir = join(process.cwd(), 'test-reports');
  const resultsDir = join(process.cwd(), 'test-results');

  [reportsDir, resultsDir].forEach((dir) => {
    try {
      mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.warn(`⚠️  Warning: Could not create directory ${dir}:`, error);
    }
  });

  return { reportsDir, resultsDir };
};

const createInitialLog = (baseURL: string): string[] => [
  '=== ANIMATION TESTING SESSION STARTED ===',
  `Started at: ${new Date().toISOString()}`,
  `Base URL: ${baseURL}`,
  `Test directory: ./tests`,
  '',
  'Test scenarios to be executed:',
  '1. Резкий скролл от Hero до About секции',
  '2. Переход по навигационной ссылке #about',
  '3. Скролл вверх-вниз с повторными входами в viewport',
  '4. Проверка анимаций карточек в секции Projects',
  '',
  'Expected criteria:',
  '- 0 cases where data-animation element in viewport fails to start animation',
  '- Animation start difference between elements in same group ≤ 150ms',
  '- Repeat viewport entries always trigger animations',
  '',
  '=== DETAILED LOGS ===',
  '',
];

const setupLogging = (reportsDir: string, baseURL: string): string => {
  const logPath = join(reportsDir, 'animations-timings.log');
  const initialLog = createInitialLog(baseURL);

  try {
    writeFileSync(logPath, initialLog.join('\n'));
  } catch (error) {
    console.warn(`⚠️  Warning: Could not create log file ${logPath}:`, error);
  }

  return logPath;
};

const checkWritePermissions = (reportsDir: string): boolean => {
  try {
    const testFile = join(reportsDir, 'write-test.tmp');
    writeFileSync(testFile, 'test');
    unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
};

const checkServerAvailability = async (
  baseURL: string,
): Promise<{
  hasGSAP: boolean;
  animationData: AnimationData;
}> => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const response = await page.goto(baseURL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    if (!response || !response.ok()) {
      throw new Error(`Server responded with status: ${response?.status() || 'no response'}`);
    }

    await page.waitForSelector('body', { state: 'attached', timeout: 5000 });

    const hasGSAP = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds timeout
        
        const checkGSAP = () => {
          if (typeof window.gsap !== 'undefined') {
            resolve(true);
          } else if (attempts >= maxAttempts) {
            resolve(false);
          } else {
            attempts++;
            setTimeout(checkGSAP, 100);
          }
        };
        checkGSAP();
      });
    });

    if (!hasGSAP) {
      console.warn('⚠️  GSAP not found after timeout - animations might not work');
    } else {
      console.log('✅ GSAP loaded successfully');
    }

    const animationData = await page.evaluate((): AnimationData => {
      const elements = document.querySelectorAll('[data-animation]');
    const withAnimate = document.querySelectorAll('[data-animation]');
      const withAnimation = document.querySelectorAll('[data-animation]');

      return {
        total: elements.length,
        withAnimate: withAnimate.length,
        withAnimation: withAnimation.length,
        elements: Array.from(elements).map((el) => {
          const htmlEl = el as HTMLElement;
          return {
            tag: htmlEl.tagName,
            type: htmlEl.getAttribute('data-animation') || 'unknown',
            className: htmlEl.className || 'no-class',
            visible: htmlEl.offsetParent !== null,
          };
        }),
      };
    });

    return { hasGSAP, animationData };
  } finally {
    await context.close();
    await browser.close();
  }
};

const logAnimationData = (
  animationData: AnimationData,
  hasGSAP: boolean,
  canWrite: boolean,
  logPath: string,
): void => {
  console.log(`📊 Found ${animationData.total} elements with animations:`);
  console.log(`   - ${animationData.withAnimate} with data-animation`);
  console.log(`   - ${animationData.withAnimation} with data-animation`);
  const visibleCount = animationData.elements?.filter((el) => el.visible).length || 0;
  console.log(`   - ${visibleCount} visible elements`);

  const logEntry = [
    `Found ${animationData.total} animation elements`,
    `GSAP available: ${hasGSAP}`,
    `Visible elements: ${visibleCount}`,
    `Write permissions: ${canWrite}`,
    `Elements: ${JSON.stringify(animationData.elements.slice(0, 5), null, 2)}${animationData.elements.length > 5 ? '...' : ''}`,
    '',
  ].join('\n');

  try {
    appendFileSync(logPath, logEntry);
  } catch (error) {
    console.warn('⚠️  Warning: Could not append to log file:', error);
  }

  if (!canWrite) {
    console.log('💾 Creating in-memory log backup');
    (global as { __animationTestLog?: string }).__animationTestLog = logEntry;
  }

  if (animationData.total === 0) {
    console.warn('⚠️  No elements with data-animation attributes found');
  } else {
    console.log('🔍 Detailed elements info:', animationData.elements.slice(0, 5));
  }
};

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('🚀 Starting global setup for animation tests...');

  try {
    const { reportsDir } = createDirectories();

    const projectConfig = config.projects[0];
    const baseURL = projectConfig?.use?.baseURL || 'http://localhost:3000';

    console.log('📋 Global Setup Configuration:');
    console.log(`Base URL: ${baseURL}`);
    console.log(`Test directory: ./tests`);
    console.log(`Workers: ${config.workers}`);

    const logPath = setupLogging(reportsDir, baseURL);
    const canWrite = checkWritePermissions(reportsDir);

    if (!canWrite) {
      console.warn('⚠️  Warning: No write permissions for test reports directory');
    }

    console.log(`🔍 Checking server availability at ${baseURL}...`);

    const { hasGSAP, animationData } = await checkServerAvailability(baseURL);
    logAnimationData(animationData, hasGSAP, canWrite, logPath);

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
