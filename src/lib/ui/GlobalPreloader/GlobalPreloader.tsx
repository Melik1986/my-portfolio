'use client';

import { useEffect, useState } from 'react';
import { Loader } from '../Loader/Loader';

/**
 * Глобальный прелоадер для первой загрузки страницы
 * Отображается только при первом посещении сайта
 */
export function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onComplete = () => {
      setIsLoading(false);
      // После размонтирования прелоадера обновим ScrollTrigger для корректных размеров
      try {
        // import динамический, чтобы не тянуть плагин раньше времени
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          if (ScrollTrigger?.refresh) {
            // Первый refresh сразу, второй через небольшой таймаут
            ScrollTrigger.refresh();
            setTimeout(() => ScrollTrigger.refresh(), 100);
          }
        });
      } catch {
        // ignore
      }
    };

    const onPreloaderComplete = () => onComplete();

    document.addEventListener('preloader:complete', onPreloaderComplete, { once: true });

    const fallbackTimer = setTimeout(onComplete, 17000);

    return () => {
      document.removeEventListener('preloader:complete', onPreloaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!isLoading) return null;

  return <Loader />;
}
