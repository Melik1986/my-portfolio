'use client';

import { useEffect } from 'react';
import { SpiralConfig } from '../config/spiral.config';
import { useSpiralState } from './useSpiralState';
import { useSpiralInitialization } from './useSpiralInitialization';
import { useSpiralAnimationCore } from './useSpiralAnimationCore';
import { useSpiralVisibility } from './useSpiralVisibility';

/**
 * Основной хук спиральной анимации
 * Композирует все подхуки для управления спиральной анимацией иконок
 * @param containerRef - ссылка на контейнер анимации
 * @param config - конфигурация анимации
 * @returns объект с состояниями и методами управления анимацией
 */
export const useSpiralAnimation = (
  containerRef: React.RefObject<HTMLElement | null>,
  config: Partial<SpiralConfig> = {},
) => {
  const { state, setState, animatorRef, finalConfig } = useSpiralState(config);

  const { initializeSpirals } = useSpiralInitialization({
    containerRef,
    finalConfig,
    animatorRef,
    setState,
  });

  const { startAnimation, stopAnimation } = useSpiralAnimationCore({
    containerRef,
    animatorRef,
    setState,
  });

  useSpiralVisibility({
    isInitialized: state.isInitialized,
    startAnimation,
    stopAnimation,
  });

  /** Инициализация спиралей */
  useEffect(() => {
    if (!state.isInitialized) {
      initializeSpirals();
    }
  }, [state.isInitialized, initializeSpirals]);

  /** Запуск анимации после инициализации */
  useEffect(() => {
    if (state.isInitialized) {
      startAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [state.isInitialized, startAnimation, stopAnimation]);

  return {
    isInitialized: state.isInitialized,
    isAnimating: state.isAnimating,
    startAnimation,
    stopAnimation,
  };
};
