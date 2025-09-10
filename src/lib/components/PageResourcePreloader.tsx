'use client';

import {
  usePageResourcePreload,
  useHoverResourcePreload,
} from '@/lib/hooks/usePageResourcePreload';

/**
 * Компонент для инициализации предзагрузки ресурсов страниц
 * Используется в клиентских компонентах для оптимизации навигации
 */
export function PageResourcePreloader() {
  // Предзагружаем ресурсы для текущей страницы
  usePageResourcePreload();

  // Предзагружаем ресурсы при hover на ссылки
  useHoverResourcePreload();

  // Компонент не рендерит ничего
  return null;
}
