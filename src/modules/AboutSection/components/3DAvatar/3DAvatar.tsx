'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import styles from './Avatar.module.scss';

export function Avatar() {
  const refs = useAvatar();
  const [isLoading, setIsLoading] = React.useState(true);

  // Скрываем загрузку после загрузки модели
  React.useEffect(() => {
    const handleModelLoaded = () => {
      setIsLoading(false);
    };

    // Слушаем событие загрузки модели
    const container = refs.current.container;
    if (container) {
      container.addEventListener('modelLoaded', handleModelLoaded);
    }

    // Fallback: скрываем через 3 секунды если модель не загрузилась
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      if (container) {
        container.removeEventListener('modelLoaded', handleModelLoaded);
      }
      clearTimeout(fallbackTimer);
    };
  }, [refs]);

  return (
    <div
      id="avaturn-container"
      ref={(el) => {
        refs.current.container = el;
      }}
      className={styles['avatar-container']}
      data-animation="slide-right"
      data-delay="0.5"
      data-duration="0.8"
      data-ease="power2.out"
    >
      {isLoading && (
        <div id="avaturn-loading" className={styles['avatar-loading']}>
          Loading...
        </div>
      )}
    </div>
  );
}
