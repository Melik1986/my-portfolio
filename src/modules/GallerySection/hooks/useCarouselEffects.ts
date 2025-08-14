'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { CAROUSEL_CONFIG } from '../config/carousel.config';

/**
 * Интерфейс пропсов для хука эффектов карусели
 */
interface UseCarouselEffectsProps {
  carouselRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
  currentIndex: number;
  nextSlideRef: React.RefObject<(() => void) | null>;
  nextSlide: () => void;
  startAutoSlide: () => void;
  stopAutoSlide: () => void;
}

/**
 * Хук для управления эффектами карусели
 * Обрабатывает IntersectionObserver и позиционирование списка
 * @param props - объект с рефами и методами для управления эффектами
 */
export const useCarouselEffects = ({
  carouselRef,
  listRef,
  currentIndex,
  nextSlideRef,
  nextSlide,
  startAutoSlide,
  stopAutoSlide,
}: UseCarouselEffectsProps) => {
  /** Установка ссылки на nextSlide для автопрокрутки */
  useEffect(() => {
    nextSlideRef.current = nextSlide;
  }, [nextSlide, nextSlideRef]);

  /** IntersectionObserver для автопрокрутки при видимости карусели */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAutoSlide();
        } else {
          stopAutoSlide();
        }
      },
      { threshold: CAROUSEL_CONFIG.intersection.threshold },
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      observer.disconnect();
      stopAutoSlide();
    };
  }, [carouselRef, startAutoSlide, stopAutoSlide]);

  /** Позиционирование списка при изменении индекса */
  useEffect(() => {
    if (listRef.current) {
      gsap.set(listRef.current, { xPercent: -100 * currentIndex });
    }
  }, [currentIndex, listRef]);
};
