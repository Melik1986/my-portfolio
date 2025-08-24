'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { GlassCard } from '@/lib/ui';
import styles from './Avatar.module.scss';

function useAvatarLoading(container: HTMLDivElement | null) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleModelLoaded = () => {
      setIsLoading(false);
    };

    if (container) {
      container.addEventListener('modelLoaded', handleModelLoaded);
    }

    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      if (container) {
        container.removeEventListener('modelLoaded', handleModelLoaded);
      }
      clearTimeout(fallbackTimer);
    };
  }, [container]);

  return isLoading;
}

function useAvatarTooltip(container: HTMLDivElement | null) {
  const [tooltipState, setTooltipState] = React.useState({
    isVisible: false,
    position: { x: 0, y: 0 },
  });

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

    if (container) {
      container.addEventListener('avatarHover', handleAvatarHover as unknown as EventListener);
      container.addEventListener('avatarLeave', handleAvatarLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('avatarHover', handleAvatarHover as unknown as EventListener);
        container.removeEventListener('avatarLeave', handleAvatarLeave);
      }
    };
  }, [container]);

  return tooltipState;
}

function AvatarContainer({
  onContainerRef,
  isLoading,
}: {
  onContainerRef: (el: HTMLDivElement | null) => void;
  isLoading: boolean;
}) {
  return (
    <div
      id="avaturn-container"
      ref={(el) => onContainerRef(el)}
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

function AvatarTooltip({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;
  return (
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
  );
}

export function Avatar() {
  const refs = useAvatar();
  const [containerEl, setContainerEl] = React.useState<HTMLDivElement | null>(null);
  const isLoading = useAvatarLoading(containerEl);
  const tooltipState = useAvatarTooltip(containerEl);

  return (
    <>
      <AvatarContainer
        onContainerRef={(el) => {
          setContainerEl(el);
          refs.current.container = el;
        }}
        isLoading={isLoading}
      />
      <AvatarTooltip isVisible={tooltipState.isVisible} />
    </>
  );
}
