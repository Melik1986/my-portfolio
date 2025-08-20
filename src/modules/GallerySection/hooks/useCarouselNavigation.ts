'use client';

import { useCallback, startTransition } from 'react';
import { CAROUSEL_CONFIG } from '../config/carousel.config';

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

const getItems = (listEl: HTMLUListElement): NodeListOf<HTMLLIElement> => {
  return listEl.querySelectorAll(':scope > li');
};

const applyTransitionClass = (element: HTMLElement | null, className: string): void => {
  if (!element) return;
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), CAROUSEL_CONFIG.transitionDurationMs);
};

const withTransition = (
  action: () => void,
  setIsAnimating: (v: boolean) => void,
  startAutoSlide: () => void,
) => {
  setIsAnimating(true);
  action();
  setTimeout(() => {
    setIsAnimating(false);
    startAutoSlide();
  }, CAROUSEL_CONFIG.transitionDurationMs);
};

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
  const doNext = useCallback(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const items = getItems(listEl);
    if (items.length === 0) return;

    listEl.appendChild(items[0]);
    applyTransitionClass(listEl.parentElement as HTMLElement, 'next');
    const newIndex = (currentIndex + 1) % (totalItems * 3);
    setCurrentIndex(newIndex);
  }, [listRef, currentIndex, totalItems, setCurrentIndex]);

  const doPrev = useCallback(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const items = getItems(listEl);
    if (items.length === 0) return;

    listEl.prepend(items[items.length - 1]);
    applyTransitionClass(listEl.parentElement as HTMLElement, 'prev');
    const newIndex = (currentIndex - 1 + totalItems * 3) % (totalItems * 3);
    setCurrentIndex(newIndex);
  }, [listRef, currentIndex, totalItems, setCurrentIndex]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    startTransition(() => {
      stopAutoSlide();
      withTransition(doNext, setIsAnimating, startAutoSlide);
    });
  }, [isAnimating, stopAutoSlide, doNext, setIsAnimating, startAutoSlide]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    startTransition(() => {
      stopAutoSlide();
      withTransition(doPrev, setIsAnimating, startAutoSlide);
    });
  }, [isAnimating, stopAutoSlide, doPrev, setIsAnimating, startAutoSlide]);

  return {
    nextSlide,
    prevSlide,
  };
};
