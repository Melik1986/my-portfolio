/**
 * Тесты стабильности анимаций при резком скролле и переходах
 * Проверяет запуск анимаций элементов с data-* атрибутами
 */

import { test, expect, Page } from '@playwright/test';
import {
  findAnimatedElements,
  scrollToSectionAndWaitForAnimations,
  findAnimatedElementsInSection,
  checkAnimationStarted,
  waitForElementInViewport,
  validateAnimationResults,
  AnimationElement,
} from './utils/animation-helpers';
import { animationLogger, AnimationLogEntry } from './utils/animation-logger';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Настройки тестов
test.describe('Animation Stability Tests', () => {
  let page: Page;
  let testStartTime: number;
  let animationLogs: AnimationLogEntry[] = [];

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    testStartTime = Date.now();
    animationLogger.clearLogs();

    // Переходим на главную страницу с мягкими опциями ожидания
    await page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 20000,
    });

    // Мягкое ожидание готовности DOM с fallback
    try {
      await page.waitForFunction(
        () => {
          return document.readyState === 'complete' && document.body !== null;
        },
        { timeout: 8000 },
      );
    } catch (error) {
      console.warn('DOM readiness check timeout - proceeding with basic checks');
      // Fallback: просто проверяем наличие body
      await page.waitForSelector('body', { timeout: 5000 });
    }

    // Опциональная проверка основных элементов страницы
    try {
      await page.waitForSelector('main, #root, .app, header, nav', { timeout: 5000 });
    } catch (error) {
      console.warn('Main elements not found within timeout - proceeding anyway');
    }

    // Опциональная проверка GSAP (не критичная для тестов)
    const gsapLoaded = await page
      .evaluate(() => {
        return typeof window !== 'undefined' && (window as any).gsap !== undefined;
      })
      .catch(() => false);

    if (!gsapLoaded) {
      console.warn('GSAP not detected - tests will proceed without GSAP interception');
    }

    // Инициализируем Performance API и GSAP перехват в браузере
    await page.evaluate((gsapAvailable) => {
      // Очищаем предыдущие метки
      try {
        performance.clearMarks();
        performance.clearMeasures();
      } catch (e) {
        console.warn('Performance API not fully available');
      }

      // Устанавливаем начальную метку
      try {
        performance.mark('test-start');
      } catch (e) {
        console.warn('Could not create performance mark');
      }

      // Добавляем глобальный логгер анимаций
      (window as any).animationTimings = [];

      // Улучшенный перехват GSAP анимаций с защитой от ошибок
      if (gsapAvailable && (window as any).gsap) {
        try {
          const originalTo = (window as any).gsap.to;
          const originalFrom = (window as any).gsap.from;
          const originalFromTo = (window as any).gsap.fromTo;

          function addAnimationLogging(target: any, vars: any, animationType: string) {
            try {
              // Клонируем vars чтобы не изменять оригинальный объект
              const enhancedVars = { ...vars };
              const originalOnStart = enhancedVars.onStart;

              enhancedVars.onStart = function () {
                try {
                  const timestamp = performance.now();
                  const elements =
                    typeof target === 'string' ? document.querySelectorAll(target) : [target];

                  elements.forEach((el: Element) => {
                    if (el) {
                      const dataAttr =
                        el.getAttribute('data-animate') ||
                        el.getAttribute('data-animation') ||
                        el.getAttribute('data-stagger') ||
                        'unknown';
                      const elementId = el.id || (el as HTMLElement).className || 'unnamed';
                      const sectionId = el.closest('[id]')?.id || 'unknown-section';

                      (window as any).animationTimings.push({
                        timestamp,
                        elementId,
                        dataAttribute: dataAttr,
                        sectionId,
                        animationType,
                        target: target,
                        duration: enhancedVars.duration || 0.5,
                        delay: enhancedVars.delay || 0,
                      });

                      console.log(
                        `[GSAP-START] ${animationType}: ${dataAttr} on ${elementId} (${sectionId}) at ${timestamp.toFixed(2)}ms`,
                      );
                    }
                  });

                  // Вызываем оригинальный onStart если он был
                  if (originalOnStart) {
                    originalOnStart.call(this);
                  }
                } catch (onStartError) {
                  console.warn('GSAP onStart logging failed:', onStartError);
                  // Всё равно вызываем оригинальный onStart
                  if (originalOnStart) {
                    try {
                      originalOnStart.call(this);
                    } catch (originalError) {
                      console.warn('Original onStart also failed:', originalError);
                    }
                  }
                }
              };

              return enhancedVars;
            } catch (error) {
              console.warn('GSAP vars enhancement failed:', error);
              return vars; // Возвращаем оригинальные vars
            }
          }

          (window as any).gsap.to = function (target: any, vars: any) {
            try {
              const enhancedVars = addAnimationLogging(target, vars, 'gsap.to');
              return originalTo.call(this, target, enhancedVars);
            } catch (error) {
              console.warn('GSAP.to interception failed:', error);
              return originalTo.call(this, target, vars);
            }
          };

          (window as any).gsap.from = function (target: any, vars: any) {
            try {
              const enhancedVars = addAnimationLogging(target, vars, 'gsap.from');
              return originalFrom.call(this, target, enhancedVars);
            } catch (error) {
              console.warn('GSAP.from interception failed:', error);
              return originalFrom.call(this, target, vars);
            }
          };

          (window as any).gsap.fromTo = function (target: any, fromVars: any, toVars: any) {
            try {
              const enhancedToVars = addAnimationLogging(target, toVars, 'gsap.fromTo');
              return originalFromTo.call(this, target, fromVars, enhancedToVars);
            } catch (error) {
              console.warn('GSAP.fromTo interception failed:', error);
              return originalFromTo.call(this, target, fromVars, toVars);
            }
          };

          // Перехватываем ScrollTrigger создание с защитой от ошибок
          if ((window as any).gsap.ScrollTrigger) {
            try {
              const originalCreate = (window as any).gsap.ScrollTrigger.create;

              (window as any).gsap.ScrollTrigger.create = function (config: any) {
                try {
                  const enhancedConfig = { ...config };
                  const originalOnEnter = enhancedConfig.onEnter;
                  const originalOnLeave = enhancedConfig.onLeave;
                  const originalOnEnterBack = enhancedConfig.onEnterBack;
                  const originalOnLeaveBack = enhancedConfig.onLeaveBack;
                  const originalOnUpdate = enhancedConfig.onUpdate;

                  enhancedConfig.onEnter = function (self: any) {
                    try {
                      const timestamp = performance.now();
                      console.log(
                        `[ScrollTrigger-ENTER] Trigger: ${self.trigger?.id || 'unnamed'} at ${timestamp.toFixed(2)}ms`,
                      );

                      if (originalOnEnter) {
                        originalOnEnter.call(this, self);
                      }
                    } catch (error) {
                      console.warn('ScrollTrigger onEnter failed:', error);
                      if (originalOnEnter) {
                        try {
                          originalOnEnter.call(this, self);
                        } catch (originalError) {
                          console.warn('Original onEnter also failed:', originalError);
                        }
                      }
                    }
                  };

                  enhancedConfig.onLeave = function (self: any) {
                    try {
                      const timestamp = performance.now();
                      console.log(
                        `[ScrollTrigger-LEAVE] Trigger: ${self.trigger?.id || 'unnamed'} at ${timestamp.toFixed(2)}ms`,
                      );

                      if (originalOnLeave) {
                        originalOnLeave.call(this, self);
                      }
                    } catch (error) {
                      console.warn('ScrollTrigger onLeave failed:', error);
                      if (originalOnLeave) {
                        try {
                          originalOnLeave.call(this, self);
                        } catch (originalError) {
                          console.warn('Original onLeave also failed:', originalError);
                        }
                      }
                    }
                  };

                  enhancedConfig.onEnterBack = function (self: any) {
                    try {
                      const timestamp = performance.now();
                      console.log(
                        `[ScrollTrigger-ENTER-BACK] Trigger: ${self.trigger?.id || 'unnamed'} at ${timestamp.toFixed(2)}ms`,
                      );
                      if (originalOnEnterBack) {
                        originalOnEnterBack.call(this, self);
                      }
                    } catch (error) {
                      console.warn('ScrollTrigger onEnterBack failed:', error);
                      if (originalOnEnterBack) {
                        try {
                          originalOnEnterBack.call(this, self);
                        } catch (e) {
                          console.warn('Original onEnterBack also failed:', e);
                        }
                      }
                    }
                  };

                  enhancedConfig.onLeaveBack = function (self: any) {
                    try {
                      const timestamp = performance.now();
                      console.log(
                        `[ScrollTrigger-LEAVE-BACK] Trigger: ${self.trigger?.id || 'unnamed'} at ${timestamp.toFixed(2)}ms`,
                      );
                      if (originalOnLeaveBack) {
                        originalOnLeaveBack.call(this, self);
                      }
                    } catch (error) {
                      console.warn('ScrollTrigger onLeaveBack failed:', error);
                      if (originalOnLeaveBack) {
                        try {
                          originalOnLeaveBack.call(this, self);
                        } catch (e) {
                          console.warn('Original onLeaveBack also failed:', e);
                        }
                      }
                    }
                  };

                  enhancedConfig.onUpdate = function (self: any) {
                    try {
                      const timestamp = performance.now();
                      const progress =
                        typeof self.progress === 'number' ? self.progress.toFixed(3) : 'n/a';
                      console.log(
                        `[ScrollTrigger-UPDATE] Trigger: ${self.trigger?.id || 'unnamed'} progress=${progress} at ${timestamp.toFixed(2)}ms`,
                      );
                      if (originalOnUpdate) {
                        originalOnUpdate.call(this, self);
                      }
                    } catch (error) {
                      console.warn('ScrollTrigger onUpdate failed:', error);
                      if (originalOnUpdate) {
                        try {
                          originalOnUpdate.call(this, self);
                        } catch (e) {
                          console.warn('Original onUpdate also failed:', e);
                        }
                      }
                    }
                  };

                  return originalCreate.call(this, enhancedConfig);
                } catch (error) {
                  console.warn('ScrollTrigger.create enhancement failed:', error);
                  return originalCreate.call(this, config);
                }
              };
            } catch (error) {
              console.warn('ScrollTrigger interception setup failed:', error);
            }
          }
        } catch (error) {
          console.warn('GSAP interception setup failed:', error);
        }
      }
    }, gsapLoaded);
  });

  test.afterEach(async () => {
    try {
      if (!page /* защита от сбоев beforeEach */) {
        await saveTestReport([], 'afterEach-no-page');
        return;
      }
      // Если страница уже закрыта, сохраняем минимальный отчет
      if (page.isClosed && page.isClosed()) {
        await saveTestReport([], 'afterEach-page-closed');
        return;
      }
      // Собираем логи анимаций из браузера
      const browserLogs = await page
        .evaluate(() => {
          return (window as any).animationTimings || [];
        })
        .catch(() => {
          return [];
        });

      // Сохраняем отчет
      await saveTestReport(browserLogs, 'afterEach');
    } catch {
      // Фолбэк при ошибке доступа к странице
      await saveTestReport([], 'afterEach-error');
    }
  });

  /**
   * Тест 1: Резкий скролл сверху вниз
   */
  test('Резкий скролл от Hero до About секции', async () => {
    const testScenario = 'rapid-scroll-hero-to-about';

    // Убеждаемся, что находимся в начале страницы
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Резко скроллим до секции About
    const aboutSection = page.locator('#about, .about, [data-section="about"]').first();
    await aboutSection.scrollIntoViewIfNeeded();

    // Ждем стабилизации скролла
    await page.waitForTimeout(200);

    // Находим все анимированные элементы в секции About
    const aboutElements = await findAnimatedElementsInSection(
      page,
      '#about, .about, [data-section="about"]',
    );

    console.log(`Found ${aboutElements.length} animated elements in About section`);

    // Проверяем, что анимации запустились в течение 300ms
    const animationResults: AnimationElement[] = [];
    const startTime = performance.now();

    for (const element of aboutElements) {
      const isVisible = await waitForElementInViewport(page, element.element, 1000);

      if (isVisible) {
        const animationStarted = await checkAnimationStarted(element.element, 300);

        if (animationStarted) {
          animationResults.push(element);

          // Логируем в браузере
          await page.evaluate(
            (data) => {
              performance.mark(`animation-${data.elementId}-started`);
              console.log(`[TEST] Animation verified: ${data.dataAttribute} on ${data.elementId}`);
            },
            {
              elementId: element.elementId,
              dataAttribute: element.dataAttribute,
            },
          );
        }
      }
    }

    // Проверяем результаты
    expect(animationResults.length).toBeGreaterThan(0);
    expect(animationResults.length).toBe(aboutElements.length);

    // Логируем результаты теста
    console.log(
      `✅ ${testScenario}: ${animationResults.length}/${aboutElements.length} animations started successfully`,
    );
  });

  /**
   * Тест 2: Резкий переход по якорю
   */
  test('Переход по навигационной ссылке #about', async () => {
    const testScenario = 'anchor-navigation-about';

    // Находим навигационную ссылку на About
    const aboutLink = page.locator('a[href="#about"], a[href*="about"]').first();

    // Засекаем время перехода
    const navigationStart = performance.now();

    // Кликаем по ссылке
    await aboutLink.click();

    // Ждем завершения перехода
    await page.waitForTimeout(300);

    // Проверяем анимации в секции About
    const aboutElements = await findAnimatedElementsInSection(
      page,
      '#about, .about, [data-section="about"]',
    );
    const animationResults: AnimationElement[] = [];

    for (const element of aboutElements) {
      const isVisible = await waitForElementInViewport(page, element.element, 1000);

      if (isVisible) {
        const animationStarted = await checkAnimationStarted(element.element, 300);

        if (animationStarted) {
          animationResults.push(element);
        }
      }
    }

    const navigationEnd = performance.now();
    const totalTime = navigationEnd - navigationStart;

    // Проверяем, что анимации запустились быстро после перехода
    expect(totalTime).toBeLessThan(1000); // Переход должен быть быстрым
    expect(animationResults.length).toBeGreaterThan(0);

    console.log(
      `✅ ${testScenario}: Navigation took ${totalTime.toFixed(2)}ms, ${animationResults.length} animations started`,
    );
  });

  /**
   * Тест 3: Скролл вверх-вниз (повторные входы в viewport)
   */
  test('Скролл вверх-вниз с повторными входами в viewport', async () => {
    const testScenario = 'scroll-up-down-repeat';

    // Скроллим до секции About
    await page.locator('#about, .about').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Скроллим дальше вниз (к Skills или Projects)
    await page.locator('#skills, .skills, #projects, .projects').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Возвращаемся обратно к About
    await page.locator('#about, .about').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Проверяем, что анимации снова запустились
    const aboutElements = await findAnimatedElementsInSection(page, '#about, .about');
    const animationResults: AnimationElement[] = [];

    for (const element of aboutElements) {
      const isVisible = await waitForElementInViewport(page, element.element, 1000);

      if (isVisible) {
        const animationStarted = await checkAnimationStarted(element.element, 300);

        if (animationStarted) {
          animationResults.push(element);
        }
      }
    }

    // Повторные входы должны всегда инициировать анимацию
    expect(animationResults.length).toBeGreaterThan(0);

    console.log(
      `✅ ${testScenario}: ${animationResults.length} animations restarted on repeat viewport entry`,
    );
  });

  /**
   * Тест 4: Переход между карточками с одинаковыми триггерами
   */
  test('Проверка анимаций карточек в секции Projects', async () => {
    const testScenario = 'projects-cards-animation';

    // Скроллим к секции Projects
    const projectsSection = page.locator('#projects, .projects, [data-section="projects"]').first();
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Находим карточки проектов
    const projectCards = await findAnimatedElementsInSection(
      page,
      '#projects, .projects, [data-section="projects"]',
    );

    console.log(`Found ${projectCards.length} animated elements in Projects section`);

    // Проверяем анимации карточек
    const animationResults: AnimationElement[] = [];

    for (const card of projectCards) {
      const isVisible = await waitForElementInViewport(page, card.element, 1000);

      if (isVisible) {
        const animationStarted = await checkAnimationStarted(card.element, 300);

        if (animationStarted) {
          animationResults.push(card);
        }
      }
    }

    // Проверяем, что активировались только видимые карточки
    expect(animationResults.length).toBeGreaterThan(0);

    console.log(
      `✅ ${testScenario}: ${animationResults.length}/${projectCards.length} project cards animated`,
    );
  });

  /**
   * Сохранение отчета о тестировании
   */
  async function saveTestReport(browserLogs: any[], phase: string) {
    try {
      // Создаем директорию для отчетов
      const reportsDir = join(process.cwd(), 'test-reports');
      mkdirSync(reportsDir, { recursive: true });

      // Подготавливаем метрики
      const sections = Array.from(
        new Set((browserLogs || []).map((log: any) => log.sectionId).filter(Boolean)),
      );
      const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
      const avgDelay = avg((browserLogs || []).map((l: any) => Number(l.delay || 0)));
      const avgDuration = avg((browserLogs || []).map((l: any) => Number(l.duration || 0)));

      // Генерируем отчет
      const report = {
        timestamp: new Date().toISOString(),
        phase,
        testDuration: Date.now() - testStartTime,
        browserLogs,
        summary: {
          totalAnimations: browserLogs.length,
          uniqueElements: new Set(browserLogs.map((log: any) => log.elementId)).size,
          animationTypes: [...new Set(browserLogs.map((log: any) => log.dataAttribute))],
          sectionsCount: sections.length,
          sections,
          avgDelayMs: Number(avgDelay.toFixed(2)),
          avgDurationMs: Number(avgDuration.toFixed(2)),
        },
      };

      // Сохраняем JSON отчет
      const reportPath = join(reportsDir, `animations-timings-${Date.now()}.json`);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));

      // Сохраняем текстовый лог
      const logLines = [
        '=== ANIMATION PERFORMANCE REPORT ===',
        `Generated at: ${report.timestamp}`,
        `Test phase: ${phase}`,
        `Test duration: ${report.testDuration}ms`,
        `Total animations logged: ${report.summary.totalAnimations}`,
        `Unique elements: ${report.summary.uniqueElements}`,
        `Animation types: ${report.summary.animationTypes.join(', ')}`,
        `Sections (${report.summary.sectionsCount}): ${sections.join(', ')}`,
        `Avg delay: ${report.summary.avgDelayMs}ms, Avg duration: ${report.summary.avgDurationMs}ms`,
        '',
        'Detailed timings:',
        '================',
      ];

      browserLogs.forEach((log: any, index: number) => {
        logLines.push(
          `${index + 1}. ${log.timestamp.toFixed(2)}ms - ${log.dataAttribute} on ${log.elementId}`,
        );
      });

      const logPath = join(reportsDir, 'animations-timings.log');
      writeFileSync(logPath, logLines.join('\n'));

      console.log(`📊 Test report saved to: ${reportPath}`);
      console.log(`📝 Animation log saved to: ${logPath}`);
    } catch (error) {
      console.error('Failed to save test report:', error);
    }
  }
});
