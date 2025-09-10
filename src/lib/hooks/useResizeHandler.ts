import { useCallback, useEffect, useRef } from 'react';

type ResizeCallback = () => void;

interface UseResizeHandlerOptions {
  /** Задержка debounce в миллисекундах (по умолчанию 150ms) */
  delay?: number;
  /** Вызывать callback немедленно при первом рендере */
  immediate?: boolean;
  /** Использовать requestAnimationFrame для оптимизации */
  useRAF?: boolean;
}

/**
 * Универсальный хук для обработки изменения размера окна с debounce
 * Дополняет существующие решения useCssVarOnResize и useHeaderBehavior
 *
 * @param callback - функция для вызова при изменении размера
 * @param options - опции конфигурации
 */
export function useResizeHandler(
  callback: ResizeCallback,
  options: UseResizeHandlerOptions = {},
): void {
  const { delay = 150, immediate = false, useRAF = true } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Обновляем ref при изменении callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (useRAF && typeof window !== 'undefined') {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
          callbackRef.current();
          rafRef.current = null;
        });
      } else {
        callbackRef.current();
      }
    }, delay);
  }, [delay, useRAF]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Вызов при первом рендере если нужно
    if (immediate) {
      callbackRef.current();
    }

    window.addEventListener('resize', debouncedCallback);

    return () => {
      window.removeEventListener('resize', debouncedCallback);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [debouncedCallback, immediate]);
}
