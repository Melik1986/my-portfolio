'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SpiralConfig, SpiralState } from '../types/spiral';
import { SpiralIconFactory } from '../utils/spiralIcon';
import { SpiralAnimator } from '../utils/spiralAnimator';
import { DEFAULT_SPIRAL_CONFIG, TECH_ICONS, SVG_SPRITE_PATH } from '../config/spiral.config';

export const useSpiralAnimation = (
  containerRef: React.RefObject<HTMLElement>,
  config: Partial<SpiralConfig> = {},
) => {
  const [state, setState] = useState<SpiralState>({
    isInitialized: false,
    isAnimating: false,
    icons: [],
  });

  const animatorRef = useRef<SpiralAnimator | null>(null);
  const finalConfig = { ...DEFAULT_SPIRAL_CONFIG, ...config };

  const createIcons = useCallback(
    (spiral: Element, spiralOffset: number) => {
      for (let i = 0; i < finalConfig.numIcons; i++) {
        const iconData = TECH_ICONS[i % TECH_ICONS.length];
        const icon = SpiralIconFactory.createIcon(iconData, spiralOffset);
        spiral.appendChild(icon);
      }
    },
    [finalConfig.numIcons],
  );

  const initializeSpirals = useCallback(async () => {
    if (!containerRef.current || state.isInitialized) return;

    try {
      const spiral1 = containerRef.current.querySelector('#spiral1');
      const spiral2 = containerRef.current.querySelector('#spiral2');

      if (spiral1 && spiral2) {
        createIcons(spiral1, 0);
        createIcons(spiral2, Math.PI);

        animatorRef.current = new SpiralAnimator(finalConfig);
        setState((prev) => ({ ...prev, isInitialized: true }));
      }
    } catch (error) {
      console.error('Failed to initialize spirals:', error);
    }
  }, [containerRef, state.isInitialized, createIcons, finalConfig]);

  const startAnimation = useCallback(() => {
    if (!animatorRef.current || !containerRef.current) return;

    const icons = containerRef.current.querySelectorAll('.icon');
    if (icons.length > 0) {
      animatorRef.current.start(icons);
      setState((prev) => ({ ...prev, isAnimating: true }));
    }
  }, [containerRef]);

  const stopAnimation = useCallback(() => {
    if (animatorRef.current) {
      animatorRef.current.stop();
      setState((prev) => ({ ...prev, isAnimating: false }));
    }
  }, []);

  // Initialize and start animation
  useEffect(() => {
    initializeSpirals().then(() => {
      if (state.isInitialized) {
        startAnimation();
      }
    });

    return () => {
      stopAnimation();
    };
  }, [state.isInitialized]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (state.isInitialized) {
        startAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.isInitialized, startAnimation, stopAnimation]);

  return {
    isInitialized: state.isInitialized,
    isAnimating: state.isAnimating,
    startAnimation,
    stopAnimation,
  };
};
