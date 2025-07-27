import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { galleryItems } from '../config/gallery.config';

export const useCarousel = () => {
  const totalItems = galleryItems.length;
  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const autoSlideInterval = 3500;
  const itemsToRender = useMemo(() => galleryItems.concat(galleryItems).concat(galleryItems), []);
  const totalDisplayed = itemsToRender.length;
  const nextSlideRef = useRef<() => void>(null);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) timerRef.current.kill();
    timerRef.current = null;
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    if (progressRef.current) gsap.set(progressRef.current, {width: 0});
    timerRef.current = gsap.to(progressRef.current, {
      width: '100%',
      duration: autoSlideInterval / 1000,
      ease: 'linear',
      onComplete: () => {
        nextSlideRef.current!();
        startAutoSlide();
      }
    });
  }, [autoSlideInterval, stopAutoSlide]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex + 1;
    gsap.to(listRef.current, {
      xPercent: -100 * newIndex,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        let adjustedIndex = newIndex;
        if (adjustedIndex >= totalItems * 2) {
          adjustedIndex = totalItems + (adjustedIndex % totalItems);
        }
        setCurrentIndex(adjustedIndex);
        gsap.set(listRef.current, {xPercent: -100 * adjustedIndex});
        setIsAnimating(false);
        startAutoSlide();
      }
    });
  }, [isAnimating, currentIndex, totalItems, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    nextSlideRef.current = nextSlide;
  }, [nextSlide]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    stopAutoSlide();
    const newIndex = currentIndex - 1;
    gsap.to(listRef.current, {
      xPercent: -100 * newIndex,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        let adjustedIndex = newIndex;
        if (adjustedIndex < totalItems) {
          adjustedIndex = totalItems * 2 + (adjustedIndex % totalItems);
        }
        setCurrentIndex(adjustedIndex);
        gsap.set(listRef.current, {xPercent: -100 * adjustedIndex});
        setIsAnimating(false);
        startAutoSlide();
      }
    });
  }, [isAnimating, currentIndex, totalItems, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    }, { threshold: 0.1 });

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      observer.disconnect();
      stopAutoSlide();
    };
  }, [startAutoSlide]);

  useEffect(() => {
    if (listRef.current) {
      gsap.set(listRef.current, {xPercent: -100 * currentIndex});
    }
  }, []);

  return {
    displayedIndex: currentIndex % totalItems,
    itemsToRender,
    nextSlide,
    prevSlide,
    carouselRef,
    listRef,
    progressRef
  };
};