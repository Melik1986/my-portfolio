'use client';

import { useState, useRef, useMemo } from 'react';
import { galleryItems } from '../config/gallery.config';

/**
 * Хук для управления состоянием карусели
 * Создает и управляет всеми состояниями и рефами карусели
 * @returns объект с состояниями и рефами карусели
 */
export const useCarouselState = () => {
  const totalItems = galleryItems.length;
  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [isAnimating, setIsAnimating] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const nextSlideRef = useRef<() => void>(null);

  /** Создает массив элементов для бесконечной прокрутки (3 копии) */
  const itemsToRender = useMemo(() => galleryItems.concat(galleryItems).concat(galleryItems), []);
  /** Вычисляет отображаемый индекс для UI */
  const displayedIndex = currentIndex % totalItems;

  return {
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
  };
};
