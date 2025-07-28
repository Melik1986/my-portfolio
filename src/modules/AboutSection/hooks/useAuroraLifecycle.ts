'use client';

import { useEffect, useCallback } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraState } from '../types/about.types';

interface UseAuroraLifecycleProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  state: AuroraState;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
  animationFrameRef: React.RefObject<number | null>;
  handleMouseMove: (e: MouseEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleResize: () => void;
  initializeAnimation: () => void;
  stopAnimation: () => void;
  resumeAnimation: () => void;
  animate: () => void;
}

const useEventListeners = ({
  containerRef,
  handleMouseMove,
  handleTouchMove,
  handleResize,
  initializeAnimation,
  stopAnimation,
  sceneManagerRef,
}: Pick<
  UseAuroraLifecycleProps,
  | 'containerRef'
  | 'handleMouseMove'
  | 'handleTouchMove'
  | 'handleResize'
  | 'initializeAnimation'
  | 'stopAnimation'
  | 'sceneManagerRef'
>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sceneManager = sceneManagerRef.current;

    // Вызываем функции напрямую, не передавая их в зависимости
    initializeAnimation();

    // Создаем обертки для стабилизации
    const stableHandleMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const stableHandleTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const stableHandleResize = () => handleResize();
    const stableStopAnimation = () => stopAnimation();

    container.addEventListener('mousemove', stableHandleMouseMove);
    container.addEventListener('touchstart', stableHandleTouchMove, { passive: true });
    container.addEventListener('touchmove', stableHandleTouchMove, { passive: true });
    window.addEventListener('resize', stableHandleResize);

    return () => {
      container.removeEventListener('mousemove', stableHandleMouseMove);
      container.removeEventListener('touchstart', stableHandleTouchMove);
      container.removeEventListener('touchmove', stableHandleTouchMove);
      window.removeEventListener('resize', stableHandleResize);

      stableStopAnimation();
      sceneManager?.destroy();
    };
  }, []); // Пустой массив зависимостей
};

const useVisibilityHandlers = ({
  stopAnimation,
  resumeAnimation,
}: Pick<UseAuroraLifecycleProps, 'stopAnimation' | 'resumeAnimation'>) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        resumeAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', stopAnimation);
    window.addEventListener('focus', resumeAnimation);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', stopAnimation);
      window.removeEventListener('focus', resumeAnimation);
    };
  }, []); // Пустой массив зависимостей
};

const useAnimationLoop = ({
  state,
  animate,
  animationFrameRef,
}: Pick<UseAuroraLifecycleProps, 'state' | 'animate' | 'animationFrameRef'>) => {
  useEffect(() => {
    if (state.isRunning) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning]); // Только состояние, не функции
};

export const useAuroraLifecycle = ({
  containerRef,
  state,
  sceneManagerRef,
  animationFrameRef,
  handleMouseMove,
  handleTouchMove,
  handleResize,
  initializeAnimation,
  stopAnimation,
  resumeAnimation,
  animate,
}: UseAuroraLifecycleProps) => {
  useEventListeners({
    containerRef,
    handleMouseMove,
    handleTouchMove,
    handleResize,
    initializeAnimation,
    stopAnimation,
    sceneManagerRef,
  });

  useVisibilityHandlers({ stopAnimation, resumeAnimation });
  useAnimationLoop({ state, animate, animationFrameRef });
};
