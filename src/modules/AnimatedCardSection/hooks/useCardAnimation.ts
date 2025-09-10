'use client';

import { useEffect, useRef } from 'react';
import { animationController } from '../core/AnimationController';
import { waitForFontsReady } from '@/lib/utils/waitForFontsReady';

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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let isCancelled = false;

    const initializeAnimation = async () => {
      try {
        // Ждём загрузки шрифтов для корректной работы SplitText
        await waitForFontsReady();

        if (isCancelled) {
          return;
        }

        if (isHeroSection) {
          animationController.initializeMaster();
        }

        animationController.registerSection(sectionIndex, wrapper);
      } catch (error) {
        console.warn('Animation initialization failed:', error);
      }
    };

    // Инициализируем после кадра, дождавшись шрифтов
    requestAnimationFrame(() => {
      void initializeAnimation();
    });

    return () => {
      isCancelled = true;
      animationController.cleanupSection(sectionIndex);
    };
  }, [sectionIndex, isHeroSection]);

  return {
    wrapperRef,
    isReady: animationController.isReady(),
    activeCardIndex: animationController.getActiveCardIndex(),
  };
};
