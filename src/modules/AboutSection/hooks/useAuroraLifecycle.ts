'use client';

import { useEffect } from 'react';
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
  stopAnimation: (updateState?: boolean) => void;
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
    const stableStopAnimation = () => stopAnimation(false); // Не обновляем состояние в cleanup

    container.addEventListener('mousemove', stableHandleMouseMove, { passive: true });
    container.addEventListener('touchstart', stableHandleTouchMove, { passive: true });
    container.addEventListener('touchmove', stableHandleTouchMove, { passive: true });
    window.addEventListener('resize', stableHandleResize, { passive: true });

    return () => {
      container.removeEventListener('mousemove', stableHandleMouseMove);
      container.removeEventListener('touchstart', stableHandleTouchMove);
      container.removeEventListener('touchmove', stableHandleTouchMove);
      window.removeEventListener('resize', stableHandleResize);

      stableStopAnimation();
      sceneManager?.destroy();
    };
  }, [
    containerRef,
    handleMouseMove,
    handleTouchMove,
    handleResize,
    initializeAnimation,
    stopAnimation,
    sceneManagerRef,
  ]);
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

    const handleBlur = () => stopAnimation();
    const handleFocus = () => resumeAnimation();

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    window.addEventListener('blur', handleBlur, { passive: true });
    window.addEventListener('focus', handleFocus, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [stopAnimation, resumeAnimation]);
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

    const currentFrame = animationFrameRef.current;
    return () => {
      if (currentFrame) {
        cancelAnimationFrame(currentFrame);
      }
    };
  }, [state.isRunning, animate, animationFrameRef]);
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
