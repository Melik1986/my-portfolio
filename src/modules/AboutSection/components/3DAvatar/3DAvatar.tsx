'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { GlassCard } from '@/lib/ui';
import styles from './Avatar.module.scss';
import { useI18n } from '@/i18n';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';

// Централизованная регистрация GSAP и плагинов
ensureGSAPRegistered();

function useAvatarLoading(container: HTMLDivElement | null) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleModelLoaded = () => setIsLoading(false);

    if (container) {
      container.addEventListener('modelLoaded', handleModelLoaded);
    }

    const fallbackTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      if (container) {
        container.removeEventListener('modelLoaded', handleModelLoaded);
      }
      clearTimeout(fallbackTimer);
    };
  }, [container]);

  return isLoading;
}

function setupTooltipScrollTrigger(
  wrapper: HTMLDivElement,
  setIsInView: (isInView: boolean) => void,
) {
  const st = ScrollTrigger.create({
    trigger: wrapper,
    start: 'top 95%',
    end: 'bottom 5%',
    onEnter: () => setIsInView(true),
    onEnterBack: () => setIsInView(true),
    onLeave: () => setIsInView(false),
    onLeaveBack: () => setIsInView(false),
    invalidateOnRefresh: true,
    fastScrollEnd: true,
  });

  // Инициализируем состояние сразу после создания
  setIsInView(st.isActive);

  return () => {
    st.kill();
  };
}

function useAvatarTooltip(container: HTMLDivElement | null, wrapper: HTMLDivElement | null) {
  const [isInView, setIsInView] = React.useState(false);
  const [hasModelLoaded, setHasModelLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!wrapper || typeof window === 'undefined') return;
    const cleanup = setupTooltipScrollTrigger(wrapper, setIsInView);
    return cleanup;
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

function useAvatarVisibilityBridge(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  containerNode: HTMLDivElement | null,
): void {
  React.useEffect(() => {
    const target = containerNode ?? wrapperRef.current;
    if (!target || typeof window === 'undefined') return;

    const dispatch = (isVisible: boolean) => {
      if (containerNode) {
        containerNode.dispatchEvent(
          new CustomEvent('avatarVisibility', { detail: { isVisible } }),
        );
      }
    };

    const st = ScrollTrigger.create({
      trigger: target,
      start: 'top 95%',
      end: 'bottom 5%',
      onEnter: () => dispatch(true),
      onEnterBack: () => dispatch(true),
      onLeave: () => dispatch(false),
      onLeaveBack: () => dispatch(false),
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    });

    // Сразу диспатчим текущее состояние видимости
    dispatch(st.isActive);

    return () => {
      st.kill();
    };
  }, [wrapperRef, containerNode]);
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

  // Подписка на видимость через ScrollTrigger (интеграция со ScrollSmoother)
  useAvatarVisibilityBridge(wrapperRef, containerNode);

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
