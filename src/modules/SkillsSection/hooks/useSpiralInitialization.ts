'use client';

import { useCallback } from 'react';
import { SpiralConfig, SpiralState } from '../config/spiral.config';
import { SpiralIconFactory } from '../utils/spiralIcon';
import { TECH_ICONS } from '../config/spiral.config';
import { SpiralAnimator } from '../utils/spiralAnimator';

/**
 * Интерфейс пропсов для хука инициализации спиралей
 */
interface UseSpiralInitializationProps {
  containerRef: React.RefObject<HTMLElement | null>;
  finalConfig: SpiralConfig;
  animatorRef: React.RefObject<SpiralAnimator | null>;
  setState: (updater: (prev: SpiralState) => SpiralState) => void;
}

/**
 * Хук для инициализации спиральных анимаций
 * Создает иконки в спиралях и настраивает аниматор
 * @param props - объект с рефами и конфигурацией
 * @returns объект с методом инициализации
 */
export const useSpiralInitialization = ({
  containerRef,
  finalConfig,
  animatorRef,
  setState,
}: UseSpiralInitializationProps) => {
  /**
   * Создает иконки в спирали
   * Генерирует SVG иконки и добавляет их в DOM спирали
   */
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

  /**
   * Инициализирует спирали с иконками
   * Создает две спирали с разным смещением и настраивает аниматор
   */
  const initializeSpirals = useCallback(async () => {
    if (!containerRef.current) return false;

    try {
      const spiral1 = containerRef.current.querySelector('#spiral1');
      const spiral2 = containerRef.current.querySelector('#spiral2');

      if (spiral1 && spiral2) {
        createIcons(spiral1, 0);
        createIcons(spiral2, Math.PI);

        animatorRef.current = new SpiralAnimator(finalConfig);
        setState((prev) => ({ ...prev, isInitialized: true }));
        return true;
      }
    } catch (error) {
      // Failed to initialize spirals
    }
    return false;
  }, [containerRef, createIcons, finalConfig, animatorRef, setState]);

  return {
    initializeSpirals,
  };
};
