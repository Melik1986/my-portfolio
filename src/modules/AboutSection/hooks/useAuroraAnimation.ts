'use client';

import { AuroraConfig } from '@/modules/AboutSection/types/about.types';
import { useAuroraState } from './useAuroraState';
import { useAuroraEvents } from './useAuroraEvents';
import { useAuroraAnimationCore } from './useAuroraAnimationCore';
import { useAuroraLifecycle } from './useAuroraLifecycle';

export const useAuroraAnimation = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: Partial<AuroraConfig> = {},
) => {
  const { state, setState, sceneManagerRef, animationFrameRef, countRef, finalConfig } =
    useAuroraState(config);

  const { handleMouseMove, handleTouchMove, handleResize } = useAuroraEvents({
    containerRef,
    setState,
    sceneManagerRef,
  });

  const { animate, initializeAnimation, stopAnimation, resumeAnimation } = useAuroraAnimationCore({
    containerRef,
    state,
    setState,
    sceneManagerRef,
    animationFrameRef,
    countRef,
    finalConfig,
  });

  useAuroraLifecycle({
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
  });

  return {
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    stopAnimation,
    resumeAnimation,
  };
};
