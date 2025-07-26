'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraConfig, AuroraState } from '@/modules/AboutSection/types/about.types';
import { DEFAULT_AURORA_CONFIG } from '@/modules/AboutSection/config/aurora.config';

export const useAuroraAnimation = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: Partial<AuroraConfig> = {},
) => {
  const [state, setState] = useState<AuroraState>({
    isRunning: false,
    isInitialized: false,
    mousePosition: { x: 0, y: 0 },
  });

  const sceneManagerRef = useRef<AuroraSceneManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const countRef = useRef(0);
  const finalConfig = { ...DEFAULT_AURORA_CONFIG, ...config };

  const updateMousePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      setState((prev) => ({
        ...prev,
        mousePosition: { x, y },
      }));
    },
    [containerRef],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    },
    [updateMousePosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [updateMousePosition],
  );

  const animate = useCallback(() => {
    if (!sceneManagerRef.current || !state.isRunning) return;

    sceneManagerRef.current.updateCamera(state.mousePosition.x, state.mousePosition.y);
    sceneManagerRef.current.updateParticles(countRef.current);
    sceneManagerRef.current.render();

    countRef.current += finalConfig.waveSpeed;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.isRunning, state.mousePosition, finalConfig.waveSpeed]);

  const initializeAnimation = useCallback(() => {
    if (!containerRef.current || state.isInitialized) return;

    // Clear container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    try {
      sceneManagerRef.current = new AuroraSceneManager(containerRef.current, finalConfig);

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        isRunning: true,
      }));
    } catch (error) {
      console.error('Failed to initialize aurora animation:', error);
    }
  }, [containerRef, state.isInitialized, finalConfig]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resumeAnimation = useCallback(() => {
    if (state.isInitialized && !state.isRunning) {
      setState((prev) => ({ ...prev, isRunning: true }));
    } else if (!state.isInitialized) {
      initializeAnimation();
    }
  }, [state.isInitialized, state.isRunning, initializeAnimation]);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !sceneManagerRef.current) return;

    const { offsetWidth, offsetHeight } = containerRef.current;
    sceneManagerRef.current.resize(offsetWidth, offsetHeight);
  }, [containerRef]);

  // Initialize and setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      sceneManagerRef.current?.destroy();
    };
  }, [
    containerRef,
    handleMouseMove,
    handleTouchMove,
    handleResize,
    initializeAnimation,
    stopAnimation,
  ]);

  // Handle visibility changes
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

  // Start animation loop when ready
  useEffect(() => {
    if (state.isRunning) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, animate]);

  return {
    isRunning: state.isRunning,
    isInitialized: state.isInitialized,
    stopAnimation,
    resumeAnimation,
  };
};
