'use client';

import { useEffect } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraState } from "../types/about.types";

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
}: Pick<UseAuroraLifecycleProps, 'containerRef' | 'handleMouseMove' | 'handleTouchMove' | 'handleResize' | 'initializeAnimation' | 'stopAnimation' | 'sceneManagerRef'>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sceneManager = sceneManagerRef.current;

    initializeAnimation();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchstart', handleTouchMove);
    container.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchstart', handleTouchMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      stopAnimation();
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

const useVisibilityHandlers = ({ stopAnimation, resumeAnimation }: Pick<UseAuroraLifecycleProps, 'stopAnimation' | 'resumeAnimation'>) => {
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
  }, [stopAnimation, resumeAnimation]);
};

const useAnimationLoop = ({ state, animate, animationFrameRef }: Pick<UseAuroraLifecycleProps, 'state' | 'animate' | 'animationFrameRef'>) => {
  useEffect(() => {
    const frameId = animationFrameRef.current;
    
    if (state.isRunning) {
      animate();
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
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
