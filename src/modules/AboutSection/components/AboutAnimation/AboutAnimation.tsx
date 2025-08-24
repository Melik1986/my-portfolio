'use client';

import React, { useEffect, useRef } from 'react';
import styles from './AboutAnimation.module.scss';
import { ParticleWaveController } from '@/modules/AboutSection/core/ParticleWaveController';
import { DEFAULT_AURORA_CONFIG } from '@/modules/AboutSection/config/aurora.config';

// Хук для инициализации контроллера
const useControllerInit = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const controllerRef = useRef<ParticleWaveController | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || controllerRef.current) return;

    const controller = new ParticleWaveController(container, DEFAULT_AURORA_CONFIG);
    controllerRef.current = controller;

    let mounted = true;
    controller
      .initialize()
      .then(() => {
        if (!mounted) return;
        controller.handleResize();
        setIsInitialized(true);
        controller.startAnimation();
      })
      .catch(() => void 0);

    return () => {
      mounted = false;
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [containerRef]);

  return { controllerRef, isInitialized };
};

// Хук для создания обработчиков событий
const useEventHandlers = (controller: ParticleWaveController | null) => {
  return React.useCallback(() => {
    if (!controller) return null;

    const onResize = () => controller.handleResize();
    const onMouseMove = (e: MouseEvent) => {
      controller.enableMouseTracking();
      controller.updateMousePosition(e.offsetX, e.offsetY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const t = e.touches[0];
      controller.enableMouseTracking();
      controller.updateMousePosition(t.clientX - rect.left, t.clientY - rect.top);
    };
    const onVisibility = () => {
      if (document.hidden) controller.stopAnimation();
      else controller.startAnimation();
    };

    return { onResize, onMouseMove, onTouchMove, onVisibility };
  }, [controller]);
};

/**
 * Компонент Aurora анимации на базе централизованного контроллера
 */
export function AboutAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { controllerRef, isInitialized } = useControllerInit(containerRef);
  const createHandlers = useEventHandlers(controllerRef.current);

  useEffect(() => {
    if (!isInitialized) return;
    const container = containerRef.current;
    if (!container) return;

    const handlers = createHandlers();
    if (!handlers) return;

    const { onResize, onMouseMove, onTouchMove, onVisibility } = handlers;

    let rafId = 0;
    const onResizeFrame = (): void => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => onResize());
    };

    window.addEventListener('resize', onResizeFrame, { passive: true });
    container.addEventListener('mousemove', onMouseMove as EventListener, { passive: true });
    container.addEventListener('touchmove', onTouchMove as EventListener, { passive: true });
    document.addEventListener('visibilitychange', onVisibility as EventListener);

    return () => {
      window.removeEventListener('resize', onResizeFrame);
      container.removeEventListener('mousemove', onMouseMove as EventListener);
      container.removeEventListener('touchmove', onTouchMove as EventListener);
      document.removeEventListener('visibilitychange', onVisibility as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isInitialized, createHandlers]);

  return <div ref={containerRef} className={styles.about__animation} id="aurora-container" />;
}
