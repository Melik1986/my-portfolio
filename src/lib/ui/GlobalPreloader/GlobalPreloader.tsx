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
    // Добавляем глобальную блокировку скролла на время прелоадера
    const lockClass = 'preload-lock';
    try {
      document.documentElement.classList.add(lockClass);
      document.body.classList.add(lockClass);
    } catch {
      // ignore
    }

    const onComplete = () => {
      setIsLoading(false);
      // Снимаем блокировку скролла
      try {
        document.documentElement.classList.remove(lockClass);
        document.body.classList.remove(lockClass);
      } catch {
        // ignore
      }

      // После размонтирования прелоадера обновим ScrollTrigger для корректных размеров
      try {
        // import динамический, чтобы не тянуть плагин раньше времени
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          if (ScrollTrigger?.refresh) {
            // Выполним после кадра, чтобы DOM успел обновиться после размонтирования
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              setTimeout(() => ScrollTrigger.refresh(), 100);
            });
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
