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

function useAvatarTooltip(container: HTMLDivElement | null, wrapper: HTMLDivElement | null) {
  const [isInView, setIsInView] = React.useState(false);
  const [hasModelLoaded, setHasModelLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!wrapper) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      root: null,
      threshold: 0.2,
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [wrapper]);

  React.useEffect(() => {
    const onLoaded = () => setHasModelLoaded(true);
    if (container) container.addEventListener('modelLoaded', onLoaded);
    return () => {
      if (container) container.removeEventListener('modelLoaded', onLoaded);
    };
  }, [container]);

  return { isVisible: isInView || hasModelLoaded, position: { x: 0, y: 0 } };
}

function AvatarContainer({
  onContainerRef,
  isLoading,
  children,
}: {
  onContainerRef: (el: HTMLDivElement | null) => void;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div
      id="avaturn-container"
      ref={(el) => onContainerRef(el)}
      className={styles['avatar-container']}
      data-testid="avaturn-container"
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
      {children}
    </div>
  );
}

function AvatarTooltip({
  isVisible,
  containerRef,
}: {
  isVisible: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useI18n();
  if (!containerRef.current) return null;

  return (
    <div
      className={`${styles.tooltip} ${isVisible ? styles['tooltip--visible'] : ''}`}
    >
      <GlassCard>
        <div className={styles.tooltip__content}>
          <h3>{t('section.about.avatar.title')}</h3>
          <p>{t('section.about.avatar.subtitle')}</p>
          <ul>
            <li>{t('section.about.avatar.list.1')}</li>
            <li>{t('section.about.avatar.list.2')}</li>
            <li>{t("section.about.avatar.list.3")}</li>
          </ul>
        </div>
      </GlassCard>
    </div>
  );
}

export function Avatar() {
  const refs = useAvatar();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerNode, setContainerNode] = React.useState<HTMLDivElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const setContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        refs.current.container = node;
        containerRef.current = node;
        setContainerNode(node);
      }
    },
    [refs],
  );

  const isLoading = useAvatarLoading(containerNode);
  const tooltipState = useAvatarTooltip(containerNode, wrapperRef.current);

  return (
    <div ref={wrapperRef} className={styles['avatar-wrapper']}>
      <AvatarContainer onContainerRef={setContainerRef} isLoading={isLoading}>
        {/* 3D Avatar will be rendered here via useAvatar hook */}
        <></>
        <AvatarTooltip
          isVisible={tooltipState.isVisible}
          containerRef={containerRef}
        />
      </AvatarContainer>
    </div>
  );
}
