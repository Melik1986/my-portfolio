'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { GlassCard } from '@/lib/ui/GlassCard';
import styles from './Avatar.module.scss';

export function Avatar() {
  const refs = useAvatar();
  const [isLoading, setIsLoading] = React.useState(true);
  const [tooltipState, setTooltipState] = React.useState({
    isVisible: false,
    position: { x: 0, y: 0 },
  });

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

  // Слушаем события hover от useAvatar
  React.useEffect(() => {
    const handleAvatarHover = (event: CustomEvent) => {
      setTooltipState({
        isVisible: true,
        position: { x: event.detail.x, y: event.detail.y },
      });
    };

    const handleAvatarLeave = () => {
      setTooltipState((prev) => ({ ...prev, isVisible: false }));
    };

    const container = refs.current.container;
    if (container) {
      container.addEventListener('avatarHover', handleAvatarHover as EventListener);
      container.addEventListener('avatarLeave', handleAvatarLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('avatarHover', handleAvatarHover as EventListener);
        container.removeEventListener('avatarLeave', handleAvatarLeave);
      }
    };
  }, [refs]);

  return (
    <>
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

      {tooltipState.isVisible && (
        <div className={`${styles.tooltip} ${styles['tooltip--visible']}`}>
          <GlassCard>
            <div className={styles.tooltip__content}>
              <h3>3D Avatar</h3>
              <p>Интерактивная модель с анимациями</p>
              <ul>
                <li>Приветствие при клике</li>
                <li>Реакция на взаимодействие</li>
                <li>Адаптивное масштабирование</li>
              </ul>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
