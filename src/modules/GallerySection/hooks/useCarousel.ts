import { useCarouselState } from './useCarouselState';
import { useCarouselAutoPlay } from './useCarouselAutoPlay';
import { useCarouselNavigation } from './useCarouselNavigation';
import { useCarouselEffects } from './useCarouselEffects';

/**
 * Основной хук карусели галереи
 * Композирует все подхуки для управления каруселью
 * @returns объект с методами и состояниями карусели
 */
export const useCarousel = () => {
  const {
    totalItems,
    currentIndex,
    setCurrentIndex,
    isAnimating,
    setIsAnimating,
    carouselRef,
    listRef,
    progressRef,
    timerRef,
    nextSlideRef,
    itemsToRender,
    displayedIndex,
  } = useCarouselState();

  const { startAutoSlide, stopAutoSlide } = useCarouselAutoPlay({
    progressRef,
    timerRef,
    nextSlideRef,
  });

  const { nextSlide, prevSlide } = useCarouselNavigation({
    totalItems,
    currentIndex,
    setCurrentIndex,
    isAnimating,
    setIsAnimating,
    listRef,
    startAutoSlide,
    stopAutoSlide,
  });

  useCarouselEffects({
    carouselRef,
    listRef,
    currentIndex,
    nextSlideRef,
    nextSlide,
    startAutoSlide,
    stopAutoSlide,
  });

  return {
    displayedIndex,
    itemsToRender,
    nextSlide,
    prevSlide,
    carouselRef,
    listRef,
    progressRef,
  };
};
