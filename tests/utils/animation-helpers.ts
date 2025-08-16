/**
 * Утилиты для работы с анимациями и data-атрибутами
 * Помогают находить и проверять анимируемые элементы
 */

import { Page, Locator } from '@playwright/test';
import { animationLogger } from './animation-logger';

export interface AnimationElement {
  element: Locator;
  dataAttribute: string;
  sectionId: string;
  elementId: string;
}

/**
 * Находит все элементы с data-animation атрибутами
 */
export async function findAnimatedElements(page: Page): Promise<AnimationElement[]> {
  const elements: AnimationElement[] = [];



  // Ищем элементы с data-animation
  const animationElements = page.locator('[data-animation]');
  const animationCount = await animationElements.count();

  for (let i = 0; i < animationCount; i++) {
    const element = animationElements.nth(i);
    const dataAttribute = (await element.getAttribute('data-animation')) || 'unknown';
    const elementId =
      (await element.getAttribute('id')) ||
      (await element.getAttribute('class')) ||
      `animation-element-${i}`;
    const sectionId = await getSectionId(element);

    elements.push({
      element,
      dataAttribute,
      sectionId,
      elementId,
    });
  }

  return elements;
}

/**
 * Определяет ID секции для элемента
 */
export async function getSectionId(element: Locator): Promise<string> {
  // Ищем ближайший родительский элемент с id
  const parentWithId = element.locator('xpath=ancestor-or-self::*[@id][1]');
  const parentId = await parentWithId.getAttribute('id').catch(() => null);

  if (parentId) {
    return parentId;
  }

  // Ищем по классам секций
  const sectionClasses = ['hero', 'about', 'skills', 'projects', 'contact', 'header'];

  for (const sectionClass of sectionClasses) {
    const sectionElement = element.locator(
      `xpath=ancestor-or-self::*[contains(@class, '${sectionClass}')][1]`,
    );
    const hasSection = (await sectionElement.count()) > 0;

    if (hasSection) {
      return sectionClass;
    }
  }

  return 'unknown-section';
}

/**
 * Ждет появления элемента в viewport
 */
export async function waitForElementInViewport(
  page: Page,
  element: Locator,
  timeout: number = 5000,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  try {
    await element.waitFor({ state: 'attached', timeout });
    await element.scrollIntoViewIfNeeded().catch(() => {});
  } catch {}

  while (Date.now() < deadline) {
    const ratio = await element.evaluate((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      const iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const area = r.width * r.height;
      const inter = ix * iy;
      return area > 0 ? inter / area : 0;
    });
    if (ratio >= 0.25) return true; // считаем видимым при >=25% пересечения
    await new Promise((res) => setTimeout(res, 50));
  }
  return false;
}

/**
 * Проверяет, запустилась ли анимация элемента
 */
export async function checkAnimationStarted(
  element: Locator,
  timeout: number = 1500,
): Promise<boolean> {
  return await element.evaluate((el, maxWait) => {
    if (!el) return false;

    let started = false;
    const start = performance.now();
    const init = getComputedStyle(el);

    const changed = () => {
      const cs = getComputedStyle(el);
      return (
        cs.opacity !== init.opacity ||
        cs.transform !== init.transform ||
        cs.filter !== init.filter ||
        cs.clipPath !== init.clipPath ||
        (el as HTMLElement).style.cssText !== ''
      );
    };

    const onStart = () => {
      started = true;
    };
    el.addEventListener('transitionstart', onStart, { once: true });
    el.addEventListener('animationstart', onStart, { once: true });

    // Проверяем GSAP анимации
    const checkGSAP = () => {
      // @ts-ignore
      if (typeof window.gsap !== 'undefined') {
        // @ts-ignore
        const gsapTimelines = window.gsap.globalTimeline.getChildren();
        return gsapTimelines.some((tl: any) => {
          return tl.isActive() && tl.targets().includes(el);
        });
      }
      return false;
    };

    if (changed() || checkGSAP()) return true;

    const observer = new MutationObserver(() => {
      if (changed() || checkGSAP()) {
        started = true;
        observer.disconnect();
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });

    return new Promise<boolean>((resolve) => {
      const tick = () => {
        if (started || changed() || checkGSAP()) {
          observer.disconnect();
          resolve(true);
          return;
        }
        if (performance.now() - start > maxWait) {
          observer.disconnect();
          resolve(false);
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, timeout);
}

/**
 * Ждет начала анимации элемента
 */
export async function waitForAnimationToStart(
  element: Locator,
  timeout: number = 3000,
): Promise<void> {
  await element.evaluate((el, maxWait) => {
    if (!el) return Promise.resolve();

    const start = performance.now();
    const init = getComputedStyle(el);

    const changed = () => {
      const cs = getComputedStyle(el);
      return (
        cs.opacity !== init.opacity ||
        cs.transform !== init.transform ||
        cs.filter !== init.filter ||
        cs.clipPath !== init.clipPath ||
        (el as HTMLElement).style.cssText !== ''
      );
    };

    // Проверяем GSAP анимации
    const checkGSAP = () => {
      // @ts-ignore
      if (typeof window.gsap !== 'undefined') {
        // @ts-ignore
        const gsapTimelines = window.gsap.globalTimeline.getChildren();
        return gsapTimelines.some((tl: any) => {
          return tl.isActive() && tl.targets().includes(el);
        });
      }
      return false;
    };

    if (changed() || checkGSAP()) return Promise.resolve();

    return new Promise<void>((resolve) => {
      let resolved = false;

      const onStart = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      el.addEventListener('transitionstart', onStart, { once: true });
      el.addEventListener('animationstart', onStart, { once: true });

      const observer = new MutationObserver(() => {
        if ((changed() || checkGSAP()) && !resolved) {
          resolved = true;
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });

      const tick = () => {
        if (resolved) return;
        if (changed() || checkGSAP()) {
          resolved = true;
          observer.disconnect();
          resolve();
          return;
        }
        if (performance.now() - start > maxWait) {
          resolved = true;
          observer.disconnect();
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, timeout);
}

/**
 * Скроллит к секции и ждет анимации
 */
export async function scrollToSectionAndWaitForAnimations(
  page: Page,
  sectionSelector: string,
  testScenario: string,
  timeout: number = 2000,
): Promise<AnimationElement[]> {
  // Скроллим к секции
  await page.locator(sectionSelector).scrollIntoViewIfNeeded();

  // Небольшая задержка для стабилизации скролла
  await page.waitForTimeout(100);

  // Находим все анимированные элементы в секции
  const sectionElements = await findAnimatedElementsInSection(page, sectionSelector);

  // Логируем анимации и проверяем их запуск
  const startTime = performance.now();
  const animatedElements: AnimationElement[] = [];

  for (const animElement of sectionElements) {
    const isInViewport = await waitForElementInViewport(page, animElement.element, timeout);

    if (isInViewport) {
      const animationStarted = await checkAnimationStarted(animElement.element, timeout);

      if (animationStarted) {
        // Логируем успешный запуск анимации
        await animElement.element.evaluate(
          (el, data) => {
            // Используем Performance API для точного логирования
            performance.mark(`animation-start-${data.elementId}`);

            // Логируем в консоль браузера
            console.log(
              `[ANIMATION] ${data.testScenario} - ${data.sectionId} - ${data.dataAttribute} started`,
            );
          },
          {
            elementId: animElement.elementId,
            testScenario,
            sectionId: animElement.sectionId,
            dataAttribute: animElement.dataAttribute,
          },
        );

        animatedElements.push(animElement);
      }
    }
  }

  return animatedElements;
}

/**
 * Находит анимированные элементы в конкретной секции
 */
export async function findAnimatedElementsInSection(
  page: Page,
  sectionSelector: string,
): Promise<AnimationElement[]> {
  const section = page.locator(sectionSelector);
  const elements: AnimationElement[] = [];



  // Ищем элементы с data-animation в секции
  const animationElements = section.locator('[data-animation]');
  const animationCount = await animationElements.count();

  for (let i = 0; i < animationCount; i++) {
    const element = animationElements.nth(i);
    const dataAttribute = (await element.getAttribute('data-animation')) || 'unknown';
    const elementId =
      (await element.getAttribute('id')) ||
      (await element.getAttribute('class')) ||
      `animation-${i}`;
    const sectionId = await getSectionId(element);

    elements.push({
      element,
      dataAttribute,
      sectionId,
      elementId,
    });
  }

  return elements;
}

/**
 * Проверяет критерии успешности анимаций
 */
export interface AnimationTestResult {
  success: boolean;
  totalElements: number;
  animatedElements: number;
  failedElements: string[];
  groupTimingIssues: string[];
  maxGroupDelay: number;
}

export function validateAnimationResults(
  animatedElements: AnimationElement[],
  expectedElements: number,
  maxGroupDelay: number = 150,
): AnimationTestResult {
  const result: AnimationTestResult = {
    success: true,
    totalElements: expectedElements,
    animatedElements: animatedElements.length,
    failedElements: [],
    groupTimingIssues: [],
    maxGroupDelay: 0,
  };

  // Проверяем, что все элементы анимировались
  if (animatedElements.length < expectedElements) {
    result.success = false;
    result.failedElements.push(
      `Expected ${expectedElements} elements, but only ${animatedElements.length} animated`,
    );
  }

  // Группируем по секциям для проверки групповых задержек
  const sectionGroups = new Map<string, AnimationElement[]>();
  animatedElements.forEach((element) => {
    if (!sectionGroups.has(element.sectionId)) {
      sectionGroups.set(element.sectionId, []);
    }
    sectionGroups.get(element.sectionId)!.push(element);
  });

  // Проверяем групповые задержки (это будет реализовано в тестах с реальными таймстампами)

  return result;
}
