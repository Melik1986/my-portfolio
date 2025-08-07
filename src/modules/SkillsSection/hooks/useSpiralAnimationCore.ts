'use client';

import { useCallback } from 'react';
import { SpiralState } from '../config/spiral.config';
import { SpiralAnimator } from '../utils/spiralAnimator';

/**
 * Интерфейс пропсов для основного хука спиральной анимации
 */
interface UseSpiralAnimationCoreProps {
  containerRef: React.RefObject<HTMLElement | null>;
  animatorRef: React.RefObject<SpiralAnimator | null>;
  setState: (updater: (prev: SpiralState) => SpiralState) => void;
}

/**
 * Хук для основной логики спиральной анимации
 * Управляет запуском и остановкой анимации иконок
 * @param props - объект с рефами и методами управления анимацией
 * @returns объект с методами управления анимацией
 */
export const useSpiralAnimationCore = ({
  containerRef,
  animatorRef,
  setState,
}: UseSpiralAnimationCoreProps) => {
  /**
   * Запускает анимацию спиральных иконок
   * Находит иконки в контейнере и запускает их анимацию
   */
  const startAnimation = useCallback(() => {
    if (!animatorRef.current || !containerRef.current) return;

    const icons = containerRef.current.querySelectorAll('.icon');
    if (icons.length > 0) {
      animatorRef.current.start(icons);
      setState((prev) => ({ ...prev, isAnimating: true }));
    }
  }, [containerRef, animatorRef, setState]);

  /**
   * Останавливает анимацию спиральных иконок
   * Прерывает текущую анимацию и обновляет состояние
   */
  const stopAnimation = useCallback(() => {
    if (animatorRef.current) {
      animatorRef.current.stop();
      setState((prev) => ({ ...prev, isAnimating: false }));
    }
  }, [animatorRef, setState]);

  return {
    startAnimation,
    stopAnimation,
  };
};
