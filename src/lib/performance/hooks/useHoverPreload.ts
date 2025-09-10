import { useCallback } from 'react';

/**
 * Хук для предзагрузки чанков при взаимодействии пользователя
 * Использует динамический импорт для предварительной загрузки модулей
 */
export function useHoverPreload<T = Record<string, unknown>>(
  importFn: () =>
    | Promise<{ default: React.ComponentType<T> }>
    | Promise<Record<string, React.ComponentType<T>>>,
) {
  const preload = useCallback(() => {
    // Предзагружаем модуль при наведении/фокусе
    importFn().catch(() => {
      // Игнорируем ошибки предзагрузки
    });
  }, [importFn]);

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}

/**
 * Утилита для создания функции предзагрузки
 */
export function createPreloadFunction<T = Record<string, unknown>>(
  importFn: () =>
    | Promise<{ default: React.ComponentType<T> }>
    | Promise<Record<string, React.ComponentType<T>>>,
) {
  let preloadPromise:
    | Promise<{ default: React.ComponentType<T> }>
    | Promise<Record<string, React.ComponentType<T>>>
    | null = null;

  return () => {
    if (!preloadPromise) {
      preloadPromise = importFn();
    }
    return preloadPromise;
  };
}
