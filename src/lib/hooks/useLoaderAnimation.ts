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

    let done = false;
    let timerId: number | null = null;

    const complete = () => {
      if (done) return;
      done = true;
      try {
        const target = el.ownerDocument ?? document;
        target.dispatchEvent(new CustomEvent('preloader:complete'));
      } catch {
        // ignore
      }
    };

    // Слушаем окончание анимации прогресс-бара (без привязки к имени анимации)
    const handleAnimationEnd = () => complete();
    el.addEventListener('animationend', handleAnimationEnd as EventListener, { once: true });

    // Надёжный fallback на случай, если CSS-анимация не завершится или отсутствует
    // Вычисляем по фактической длительности/задержке анимации элемента
    const toMs = (v: string) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return 0;
      return v.trim().endsWith('ms') ? n : n * 1000;
    };

    const cs = window.getComputedStyle(el);
    const durs = cs.animationDuration.split(',').map((s) => toMs(s.trim()));
    const dels = cs.animationDelay.split(',').map((s) => toMs(s.trim()));
    const maxDur = Math.max(0, ...durs);
    const maxDel = Math.max(0, ...dels);
    const fallbackMs = Math.max(maxDur + maxDel + 800, 4000); // +буфер 0.8s

    timerId = window.setTimeout(complete, fallbackMs);

    return () => {
      el.removeEventListener('animationend', handleAnimationEnd as EventListener);
      if (timerId) window.clearTimeout(timerId);
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
