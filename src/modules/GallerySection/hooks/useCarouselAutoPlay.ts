'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { CAROUSEL_CONFIG } from '../config/carousel.config';

/**
 * Интерфейс пропсов для хука автопрокрутки карусели
 */
interface UseCarouselAutoPlayProps {
  progressRef: React.RefObject<HTMLDivElement | null>;
  timerRef: React.RefObject<gsap.core.Tween | null>;
  nextSlideRef: React.RefObject<(() => void) | null>;
}

/**
 * Хук для управления автопрокруткой карусели
 * Обеспечивает автоматическое переключение слайдов с прогресс-баром
 * @param props - объект с рефами для управления автопрокруткой
 * @returns объект с методами управления автопрокруткой
 */
export const useCarouselAutoPlay = ({
  progressRef,
  timerRef,
  nextSlideRef,
}: UseCarouselAutoPlayProps) => {
  /**
   * Останавливает автопрокрутку карусели
   * Убивает текущий таймер и сбрасывает ссылку
   */
  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) timerRef.current.kill();
    timerRef.current = null;
    if (progressRef.current) gsap.set(progressRef.current, { width: 0 });
  }, [timerRef, progressRef]);

  /**
   * Запускает автопрокрутку карусели
   * Создает анимацию прогресс-бара и автоматически переключает слайды
   */
  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    if (progressRef.current) gsap.set(progressRef.current, { width: 0 });
    timerRef.current = gsap.to(progressRef.current, {
      width: '100%',
      duration: CAROUSEL_CONFIG.progress.duration,
      ease: CAROUSEL_CONFIG.progress.ease,
      onComplete: () => {
        if (nextSlideRef.current) nextSlideRef.current();
      },
    });
  }, [progressRef, timerRef, nextSlideRef, stopAutoSlide]);

  return {
    startAutoSlide,
    stopAutoSlide,
  };
};
