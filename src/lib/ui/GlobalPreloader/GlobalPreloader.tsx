'use client';

import { useEffect, useState } from 'react';
import { Loader } from '../Loader/Loader';

/**
 * Глобальный прелоадер для первой загрузки страницы
 * Отображается только при первом посещении сайта
 */
export const GlobalPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const onComplete = () => {
      setIsLoading(false);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };

    const onPreloaderComplete = () => onComplete();

    document.addEventListener('preloader:complete', onPreloaderComplete, { once: true });

    fallbackTimer = setTimeout(onComplete, 15000);

    return () => {
      document.removeEventListener('preloader:complete', onPreloaderComplete);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  if (!isLoading) return null;

  return <Loader />;
};