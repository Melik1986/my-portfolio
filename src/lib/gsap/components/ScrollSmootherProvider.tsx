'use client';

import { ReactNode, useEffect } from 'react';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

interface ScrollSmootherProviderProps {
  children: ReactNode;
}

export function ScrollSmootherProvider({ children }: ScrollSmootherProviderProps) {
  ensureGSAPRegistered();
  const { isReady } = useScrollSmoother();

  // Глобальная обработка resize / orientationchange для корректного пересчёта ScrollTrigger
  useEffect(() => {
    if (!isReady) return;

    let rafId = 0 as number | 0;

    const refresh = () => {
      // Делаем двойной refresh для устойчивости после смены ориентации/перекладки лейаута
      import('gsap/ScrollTrigger')
        .then(({ ScrollTrigger }) => {
          if (!ScrollTrigger?.refresh) return;
          ScrollTrigger.refresh();
          setTimeout(() => ScrollTrigger.refresh(), 100);
        })
        .catch(() => {});
    };

    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(refresh);
    };

    // orientationchange не на всех браузерах надёжен, дублим через matchMedia
    const mqlPortrait = window.matchMedia('(orientation: portrait)');
    const mqlLandscape = window.matchMedia('(orientation: landscape)');

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    mqlPortrait.addEventListener?.('change', onResize);
    mqlLandscape.addEventListener?.('change', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      mqlPortrait.removeEventListener?.('change', onResize);
      mqlLandscape.removeEventListener?.('change', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isReady]);

  // Рендерим детей только после инициализации ScrollSmoother
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
