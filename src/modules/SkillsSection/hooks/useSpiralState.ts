'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { SpiralConfig, SpiralState } from '../config/spiral.config';
import { SpiralAnimator } from '../utils/spiralAnimator';
import { DEFAULT_SPIRAL_CONFIG } from '../config/spiral.config';

/**
 * Хук для управления состоянием спиральной анимации
 * Создает состояния и рефы для управления спиралями
 * @param config - конфигурация спиральной анимации
 * @returns объект с состояниями и рефами
 */
export const useSpiralState = (config: Partial<SpiralConfig> = {}) => {
  const [state, setStateInternal] = useState<SpiralState>({
    isInitialized: false,
    isAnimating: false,
    icons: [],
  });

  /** Стабильная версия setState для предотвращения бесконечных циклов */
  const setState = useCallback((updater: (prev: SpiralState) => SpiralState) => {
    setStateInternal(updater);
  }, []);

  /** Ссылка на аниматор спиралей */
  const animatorRef = useRef<SpiralAnimator | null>(null);
  /** Финальная конфигурация с дефолтными значениями */
  const finalConfig = useMemo(() => ({ ...DEFAULT_SPIRAL_CONFIG, ...config }), [config]);

  return {
    state,
    setState,
    animatorRef,
    finalConfig,
  };
};
