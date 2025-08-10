'use client';

import { useEffect, useRef } from 'react';
import { animationController } from '../core/AnimationController';

interface UseCardAnimationProps {
  sectionIndex: number;
  isHeroSection?: boolean;
}

/**
 * Оптимизированный хук для управления анимациями карточек
 */
export const useCardAnimation = ({
  sectionIndex,
  isHeroSection = false,
}: UseCardAnimationProps) => {
  const wrapperRef = useRef<HTMLLIElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || isInitializedRef.current) return;

    const initializeAnimation = () => {
      try {
        if (isHeroSection) {
          animationController.initializeMaster();
        }

        animationController.registerSection(sectionIndex, wrapper);
        
        isInitializedRef.current = true;
      } catch (error) {
        console.warn('Animation initialization failed:', error);
      }
    };

    requestAnimationFrame(initializeAnimation);

    return () => {
      if (isInitializedRef.current) {
        animationController.cleanupSection(sectionIndex);
        isInitializedRef.current = false;
      }
    };
  }, [sectionIndex, isHeroSection]);

  return {
    wrapperRef,
    isReady: animationController.isReady(),
    activeCardIndex: animationController.getActiveCardIndex(),
  };
};