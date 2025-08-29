'use client';

import React from 'react';
import { createPortal } from 'react-dom';
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

function AvatarTooltip({
  isVisible,
  position,
}: {
  isVisible: boolean;
  position?: { x: number; y: number } | null;
}) {
  const { t } = useI18n();
  if (!isVisible) return null;

  // position is in client coordinates; render tooltip in a portal to avoid
  // being clipped/overlapped by other sections without changing section z-index
  const style: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: position.x,
        top: position.y - 12, // lift tooltip slightly above cursor
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'auto',
      }
    : { position: 'fixed', left: '50%', top: 60, transform: 'translateX(-50%)' };

  const node = (
    <div className={`${styles.tooltip} ${styles['tooltip--visible']}`} style={style}>
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

  return typeof document !== 'undefined' ? createPortal(node, document.body) : node;
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
