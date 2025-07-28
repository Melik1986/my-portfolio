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
  const { adjustIndex } = useAdjustIndex(totalItems);
  const { handleAnimationComplete } = useHandleAnimationComplete({
    adjustIndex,
    setCurrentIndex,
    listRef,
    setIsAnimating,
    startAutoSlide,
  });
  const { createTransitionAnimation } = useCreateTransitionAnimation({
    listRef,
    handleAnimationComplete,
  });
  const { handleSlideTransition } = useHandleSlideTransition({ createTransitionAnimation });

  const { nextSlide } = useNextSlide({
    isAnimating,
    setIsAnimating,
    stopAutoSlide,
    currentIndex,
    handleSlideTransition,
  });
  const { prevSlide } = usePrevSlide({
    isAnimating,
    setIsAnimating,
    stopAutoSlide,
    currentIndex,
    handleSlideTransition,
  });

  return {
    nextSlide,
    prevSlide,
  };
};

/**
 * Корректирует индекс для бесконечной прокрутки
 */
const useAdjustIndex = (totalItems: number) => {
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
  return { adjustIndex };
};

/**
 * Обрабатывает завершение анимации перехода
 */
const useHandleAnimationComplete = ({
  adjustIndex,
  setCurrentIndex,
  listRef,
  setIsAnimating,
  startAutoSlide,
}: {
  adjustIndex: (newIndex: number) => number;
  setCurrentIndex: (index: number) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  setIsAnimating: (animating: boolean) => void;
  startAutoSlide: () => void;
}) => {
  const handleAnimationComplete = useCallback(
    (newIndex: number) => {
      const adjustedIndex = adjustIndex(newIndex);
      setCurrentIndex(adjustedIndex);
      gsap.set(listRef.current, { xPercent: -100 * adjustedIndex });
      setIsAnimating(false);
      startAutoSlide();
    },
    [adjustIndex, setCurrentIndex, listRef, setIsAnimating, startAutoSlide],
  );
  return { handleAnimationComplete };
};

/**
 * Создает анимацию перехода
 */
const useCreateTransitionAnimation = ({
  listRef,
  handleAnimationComplete,
}: {
  listRef: React.RefObject<HTMLUListElement | null>;
  handleAnimationComplete: (newIndex: number) => void;
}) => {
  const createTransitionAnimation = useCallback(
    (newIndex: number) => {
      return gsap.to(listRef.current, {
        xPercent: -100 * newIndex,
        duration: CAROUSEL_CONFIG.animation.duration,
        ease: CAROUSEL_CONFIG.animation.ease,
        onComplete: () => handleAnimationComplete(newIndex),
      });
    },
    [listRef, handleAnimationComplete],
  );
  return { createTransitionAnimation };
};

/**
 * Обрабатывает переход между слайдами с анимацией
 */
const useHandleSlideTransition = ({
  createTransitionAnimation,
}: {
  createTransitionAnimation: (newIndex: number) => gsap.core.Tween;
}) => {
  const handleSlideTransition = useCallback(
    (newIndex: number) => {
      createTransitionAnimation(newIndex);
    },
    [createTransitionAnimation],
  );
  return { handleSlideTransition };
};

/**
 * Переключает на следующий слайд
 */
const useNextSlide = ({
  isAnimating,
  setIsAnimating,
  stopAutoSlide,
  currentIndex,
  handleSlideTransition,
}: {
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  stopAutoSlide: () => void;
  currentIndex: number;
  handleSlideTransition: (newIndex: number) => void;
}) => {
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex + 1;
    handleSlideTransition(newIndex);
  }, [isAnimating, setIsAnimating, stopAutoSlide, currentIndex, handleSlideTransition]);
  return { nextSlide };
};

/**
 * Переключает на предыдущий слайд
 */
const usePrevSlide = ({
  isAnimating,
  setIsAnimating,
  stopAutoSlide,
  currentIndex,
  handleSlideTransition,
}: {
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  stopAutoSlide: () => void;
  currentIndex: number;
  handleSlideTransition: (newIndex: number) => void;
}) => {
  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex - 1;
    handleSlideTransition(newIndex);
  }, [isAnimating, setIsAnimating, stopAutoSlide, currentIndex, handleSlideTransition]);
  return { prevSlide };
};
