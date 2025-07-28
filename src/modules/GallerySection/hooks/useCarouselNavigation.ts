'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { CAROUSEL_CONFIG } from '../config/carousel.config';

/**
 * Интерфейс пропсов для хука навигации карусели
 */
interface UseCarouselNavigationProps {
  totalItems: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  startAutoSlide: () => void;
  stopAutoSlide: () => void;
}

/**
 * Хук для управления навигацией карусели
 * Обеспечивает переходы между слайдами с анимацией
 * @param props - объект с состояниями и методами для навигации
 * @returns объект с методами навигации
 */
export const useCarouselNavigation = ({
  totalItems,
  currentIndex,
  setCurrentIndex,
  isAnimating,
  setIsAnimating,
  listRef,
  startAutoSlide,
  stopAutoSlide,
}: UseCarouselNavigationProps) => {
  /**
   * Корректирует индекс для бесконечной прокрутки
   * Обеспечивает плавный переход между началом и концом списка
   */
  const adjustIndex = useCallback(
    (newIndex: number): number => {
      if (newIndex >= totalItems * 2) {
        return totalItems + (newIndex % totalItems);
      }
      if (newIndex < totalItems) {
        return totalItems * 2 + (newIndex % totalItems);
      }
      return newIndex;
    },
    [totalItems],
  );

  /**
   * Обрабатывает переход между слайдами с анимацией
   * Выполняет анимацию и корректирует индекс после завершения
   */
  const handleSlideTransition = useCallback(
    (newIndex: number) => {
      gsap.to(listRef.current, {
        xPercent: -100 * newIndex,
        duration: CAROUSEL_CONFIG.animation.duration,
        ease: CAROUSEL_CONFIG.animation.ease,
        onComplete: () => {
          const adjustedIndex = adjustIndex(newIndex);
          setCurrentIndex(adjustedIndex);
          gsap.set(listRef.current, { xPercent: -100 * adjustedIndex });
          setIsAnimating(false);
          startAutoSlide();
        },
      });
    },
    [listRef, adjustIndex, setCurrentIndex, setIsAnimating, startAutoSlide],
  );

  /**
   * Переключает на следующий слайд
   * Проверяет состояние анимации и запускает переход
   */
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex + 1;
    handleSlideTransition(newIndex);
  }, [isAnimating, setIsAnimating, stopAutoSlide, currentIndex, handleSlideTransition]);

  /**
   * Переключает на предыдущий слайд
   * Проверяет состояние анимации и запускает переход
   */
  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex - 1;
    handleSlideTransition(newIndex);
  }, [isAnimating, setIsAnimating, stopAutoSlide, currentIndex, handleSlideTransition]);

  return {
    nextSlide,
    prevSlide,
  };
};
