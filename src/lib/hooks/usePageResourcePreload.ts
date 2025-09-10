'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { preloadPageResources } from '@/lib/performance/resourcePreloader';

/**
 * Хук для предзагрузки ресурсов страницы при навигации
 */
export function usePageResourcePreload() {
  const pathname = usePathname();

  useEffect(() => {
    // Определяем страницу по pathname
    const getPageFromPath = (path: string): string => {
      if (path === '/') return 'home';
      if (path.startsWith('/about')) return 'about';
      if (path.startsWith('/projects')) return 'projects';
      if (path.startsWith('/contact')) return 'contact';
      return 'home'; // fallback
    };

    const currentPage = getPageFromPath(pathname);

    // Предзагружаем ресурсы для текущей страницы
    preloadPageResources(currentPage);
  }, [pathname]);
}

/**
 * Хук для предзагрузки ресурсов при hover на ссылки
 */
export function useHoverResourcePreload() {
  useEffect(() => {
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (!link || !link.href) return;

      // Извлекаем pathname из href
      try {
        const url = new URL(link.href);
        const path = url.pathname;

        // Предзагружаем ресурсы для целевой страницы
        const getPageFromPath = (path: string): string => {
          if (path === '/') return 'home';
          if (path.startsWith('/about')) return 'about';
          if (path.startsWith('/projects')) return 'projects';
          if (path.startsWith('/contact')) return 'contact';
          return 'home';
        };

        const targetPage = getPageFromPath(path);
        preloadPageResources(targetPage);
      } catch {
        // Игнорируем ошибки парсинга URL
      }
    };

    // Добавляем обработчик на все ссылки
    document.addEventListener('mouseover', handleLinkHover);

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, []);
}
