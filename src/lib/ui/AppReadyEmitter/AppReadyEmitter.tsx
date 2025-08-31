'use client';

import { useEffect } from 'react';
import { waitForFontsReady } from '@/lib/utils/waitForFontsReady';

/**
 * Компонент отслеживает готовность критических ресурсов приложения
 * и сигнализирует о готовности через глобальный флаг и событие
 */
export function AppReadyEmitter() {
  useEffect(() => {
    let isReady = false;

    const markAppReady = () => {
      if (isReady) return;
      isReady = true;

      try {
        // Устанавливаем глобальный флаг
        (window as unknown as { __app_ready__?: boolean }).__app_ready__ = true;
        
        // Диспатчим событие для useLoaderAnimation
        document.dispatchEvent(new CustomEvent('app:ready'));
      } catch {
        // ignore
      }
    };

    const checkReadiness = async () => {
      try {
        // Проверяем автоматизированный браузер (E2E тесты)
        const isAutomation = (
          typeof navigator !== 'undefined' &&
          (navigator as unknown as { webdriver?: boolean }).webdriver === true
        );

        if (isAutomation) {
          // В E2E тестах сразу помечаем готовым
          markAppReady();
          return;
        }

        // Ждем загрузку всех ресурсов
        const windowLoadPromise = new Promise<void>((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', () => resolve(), { once: true });
          }
        });

        // Ждем готовность шрифтов
        const fontsPromise = waitForFontsReady(4000);

        // Ждем критические изображения (аватар, ключевые картинки)
        const imagesPromise = waitForCriticalImages();

        // Ждем все ресурсы с общим таймаутом
        await Promise.race([
          Promise.all([windowLoadPromise, fontsPromise, imagesPromise]),
          new Promise<void>((resolve) => setTimeout(resolve, 8000)) // Fallback 8 сек
        ]);

        markAppReady();
      } catch {
        // В случае ошибки все равно помечаем готовым
        markAppReady();
      }
    };

    void checkReadiness();
  }, []);

  return null;
}

/**
 * Ждет загрузку критических изображений
 */
function waitForCriticalImages(timeoutMs = 5000): Promise<void> {
  return new Promise<void>((resolve) => {
    try {
      // Селекторы для критических изображений
      const criticalSelectors = [
        '[data-critical-image]',
        '.hero__avatar img',
        '.about__image img',
        'img[priority="true"]'
      ];

      const images: HTMLImageElement[] = [];
      
      criticalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el instanceof HTMLImageElement) {
            images.push(el);
          }
        });
      });

      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          resolve();
        }
      };

      images.forEach(img => {
        if (img.complete && img.naturalHeight > 0) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete, { once: true });
          img.addEventListener('error', checkComplete, { once: true });
        }
      });

      // Таймаут на случай зависших изображений
      setTimeout(resolve, timeoutMs);
    } catch {
      resolve();
    }
  });
}