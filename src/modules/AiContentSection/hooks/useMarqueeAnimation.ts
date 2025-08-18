import { useState, useEffect, useCallback } from 'react';
import { MarqueeAnimationState } from '../types/AiContent.types';

export const useMarqueeAnimation = (): MarqueeAnimationState => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
    setIsActive(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    const element = document.querySelector('[data-marquee-section]');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleIntersection]);

  return { isVisible, isActive };
};
