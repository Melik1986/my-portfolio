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
