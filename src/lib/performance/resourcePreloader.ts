/**
 * Утилита для предзагрузки статических ресурсов
 * Использует preload/preinit из react-dom для оптимизации загрузки
 */

import { preload, preinit } from 'react-dom';

/**
 * Глобальный обработчик ошибок для link элементов
 */
function setupLinkErrorHandler() {
  if (typeof window === 'undefined') return;

  // Обработчик для всех ошибок link элементов
  document.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement;

      // Проверяем, что это link элемент
      if (target && target.tagName === 'LINK') {
        const linkElement = target as HTMLLinkElement;
        console.warn(`Failed to load resource: ${linkElement.href}`, {
          rel: linkElement.rel,
          as: linkElement.getAttribute('as'),
          href: linkElement.href,
        });

        // Предотвращаем всплытие ошибки в консоль
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  ); // Используем capture phase
}

// Инициализируем обработчик при загрузке модуля
if (typeof window !== 'undefined') {
  setupLinkErrorHandler();
}

interface NetworkInformation {
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

/**
 * Предзагрузка критических шрифтов
 * ОТКЛЮЧЕНО: Next.js автоматически оптимизирует загрузку шрифтов
 */
export function preloadCriticalFonts() {
  if (typeof window === 'undefined') return;

  // Отключено для избежания конфликта с Next.js font optimization
  // Next.js автоматически предзагружает шрифты, объявленные в layout.tsx
  console.log('Font preloading handled by Next.js optimization');
}

/**
 * Предзагрузка критических изображений
 */
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return;

  const isMobile = window.innerWidth < 768;
  const heroImage = isMobile ? '/images/banner_mobile.webp' : '/images/banner_desktop.webp';

  const images = ['/sprite/logo.svg', heroImage, '/images/melik.svg', '/images/musinian.svg'];

  images.forEach((imageUrl) => {
    try {
      preload(imageUrl, {
        as: 'image',
        fetchPriority: 'high',
      });
    } catch (error) {
      console.warn(`Failed to preload image: ${imageUrl}`, error);
    }
  });
}

/**
 * Предзагрузка внешних скриптов
 */
export function preinitExternalScripts() {
  if (typeof window === 'undefined') return;

  // Библиотеки установлены локально в node_modules, внешние CDN не нужны
  const scripts: string[] = [
    // Three.js и ECharts загружаются через динамические импорты в компонентах
  ];

  scripts.forEach((scriptUrl) => {
    try {
      preinit(scriptUrl, {
        as: 'script',
        crossOrigin: 'anonymous',
        fetchPriority: 'low', // Не блокируем критический рендеринг
      });
    } catch (error) {
      console.warn(`Failed to preinit script: ${scriptUrl}`, error);
    }
  });
}

/**
 * Условная предзагрузка ресурсов на основе устройства
 */
export function conditionalResourcePreload() {
  if (typeof window === 'undefined') return;

  const isMobile = window.innerWidth < 768;
  const isSlowConnection =
    'connection' in navigator &&
    (navigator as NavigatorWithConnection).connection?.effectiveType === 'slow-2g';

  // На мобильных устройствах предзагружаем меньше ресурсов
  if (!isMobile && !isSlowConnection) {
    // Видео файлы отсутствуют в проекте, пропускаем предзагрузку
    console.log('Video preloading skipped - no video files available');
  }

  // Предзагружаем изображения следующих секций (после hero)
  if (!isSlowConnection) {
    const nextSectionImages = ['/images/catalog/project1.webp', '/images/poster/poster1.webp'];

    // Задержка для предзагрузки неприоритетных ресурсов
    setTimeout(() => {
      nextSectionImages.forEach((imageUrl) => {
        try {
          preload(imageUrl, {
            as: 'image',
            fetchPriority: 'low',
          });
        } catch (error) {
          console.warn(`Failed to preload image: ${imageUrl}`, error);
        }
      });
    }, 2000);
  }
}

/**
 * Инициализация всех предзагрузок
 */
export function initResourcePreloading() {
  // Критические ресурсы загружаем сразу
  preloadCriticalFonts();
  preloadCriticalImages();

  // Внешние скрипты с задержкой
  setTimeout(() => {
    preinitExternalScripts();
  }, 1000);

  // Условная предзагрузка с задержкой
  setTimeout(() => {
    conditionalResourcePreload();
  }, 1500);
}

/**
 * Предзагрузка ресурсов для конкретной страницы
 */
export function preloadPageResources(page?: string) {
  if (typeof window === 'undefined') return;

  // Определяем текущую страницу если не передана
  const currentPage = page || window.location.pathname.split('/')[1] || 'home';

  const pageResources: Record<string, string[]> = {
    home: [], // Hero изображения уже предзагружены в preloadCriticalImages
    about: ['/model/avatar.glb'], // 3D модель аватара
    projects: [
      '/images/catalog/project1.webp',
      '/images/catalog/project2.webp',
      '/images/catalog/project3.webp',
      '/images/catalog/project4.webp',
      '/images/catalog/project5.webp',
    ],
    ai: [
      '/images/poster/poster1.webp',
      '/images/poster/poster2.webp',
      '/images/poster/poster3.webp',
      '/images/poster/poster4.webp',
      '/images/poster/poster5.webp',
    ],
  };

  const resources = pageResources[currentPage] || [];

  resources.forEach((resourceUrl) => {
    try {
      if (resourceUrl.endsWith('.glb')) {
        // Для 3D моделей используем обычный fetch для предзагрузки
        fetch(resourceUrl).catch(() => {});
      } else {
        preload(resourceUrl, {
          as: 'image',
          fetchPriority: 'low',
        });
      }
    } catch (error) {
      console.warn(`Failed to preload page resource: ${resourceUrl}`, error);
    }
  });
}
