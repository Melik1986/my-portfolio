'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { GlassCard } from '@/lib/ui';
import styles from './Avatar.module.scss';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
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
          {t('common.loading')}
        </div>
      )}
    </div>
  );
}

function AvatarTooltip({ isVisible }: { isVisible: boolean }) {
  const { t } = useI18n();
  if (!isVisible) return null;
  return (
    <div className={`${styles.tooltip} ${styles['tooltip--visible']}`}>
      <GlassCard>
        <div className={styles.tooltip__content}>
          <h3>{t('section.about.avatar.title')}</h3>
          <p>{t('section.about.avatar.subtitle')}</p>
          <ul>
            <li>{t('section.about.avatar.features.greeting')}</li>
            <li>{t('section.about.avatar.features.reactivity')}</li>
            <li>{t('section.about.avatar.features.scaling')}</li>
          </ul>
        </div>
      </GlassCard>
    </div>
  );
}

export function Avatar() {
  console.log('[Avatar] Component rendering');
  const refs = useAvatar();
  const [containerEl, setContainerEl] = React.useState<HTMLDivElement | null>(null);
  const isLoading = useAvatarLoading(containerEl);
  const tooltipState = useAvatarTooltip(containerEl);
  
  React.useEffect(() => {
    console.log('[Avatar] Container element:', containerEl);
    console.log('[Avatar] refs.current:', refs.current);
  }, [containerEl, refs]);

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
