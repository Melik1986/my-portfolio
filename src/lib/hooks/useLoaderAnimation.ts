'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LoaderHookResult, PreloaderConfig } from '@/lib/types/loader.types';

/**
 * Хук управляет минимальной логикой доступности прелоадера,
 * не вмешиваясь в визуальные анимации (они целиком в CSS).
 */
export function useLoaderAnimation(config?: PreloaderConfig): LoaderHookResult {
  // Прелоадер больше не скрывается через aria-hidden — размонтирование делает GlobalPreloader
  const [isHidden] = useState(false);

  const progressSelector = config?.progressBarSelector ?? '[data-preloader-progress]';

  useEffect(() => {
    const el = document.querySelector(progressSelector) as HTMLElement | null;
    if (!el) return;

    const complete = () => {
      try {
        const target = el.ownerDocument ?? document;
        target.dispatchEvent(new CustomEvent('preloader:complete'));
      } catch {
        // ignore
      }
    };

    // Ждем окончания fade-out корневого контейнера прелоадера
    const root = (el.closest('[data-preloader-root]') as HTMLElement | null) ?? el;

    const handleRootEnd = (e: AnimationEvent) => {
      if (e.animationName !== 'loaderFadeIn') return;
      complete();
    };

    root.addEventListener('animationend', handleRootEnd as EventListener, { once: true });

    return () => {
      root.removeEventListener('animationend', handleRootEnd as EventListener);
    };
  }, [progressSelector]);

  const containerProps = useMemo(
    () => ({
      role: 'status',
      'aria-live': 'polite',
      'data-preloader-root': 'true',
    }),
    [],
  );

  return { isHidden, containerProps };
}
