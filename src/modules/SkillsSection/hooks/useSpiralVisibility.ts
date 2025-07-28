'use client';

import { useEffect } from 'react';

/**
 * Интерфейс пропсов для хука видимости спиралей
 */
interface UseSpiralVisibilityProps {
  isInitialized: boolean;
  startAnimation: () => void;
  stopAnimation: () => void;
}

/**
 * Хук для обработки изменений видимости страницы
 * Останавливает анимацию при скрытии вкладки и возобновляет при показе
 * @param props - объект с состояниями и методами анимации
 */
export const useSpiralVisibility = ({
  isInitialized,
  startAnimation,
  stopAnimation,
}: UseSpiralVisibilityProps) => {
  /** Обработчик изменений видимости страницы */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (isInitialized) {
        startAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, startAnimation, stopAnimation]);
}; 