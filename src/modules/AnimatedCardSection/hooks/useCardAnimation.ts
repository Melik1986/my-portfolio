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
    console.log('[useCardAnimation] Effect started', {
      sectionIndex,
      isHeroSection,
      hasElement: !!wrapperRef.current,
      isInitialized: isInitializedRef.current
    });

    const wrapper = wrapperRef.current;
    if (!wrapper || isInitializedRef.current) {
      console.warn('[useCardAnimation] Early return', {
        hasWrapper: !!wrapper,
        isInitialized: isInitializedRef.current
      });
      return;
    }

    console.log('[useCardAnimation] Wrapper element found', {
      element: wrapper.tagName,
      classList: Array.from(wrapper.classList),
      sectionIndex
    });

    const initializeAnimation = () => {
      try {
        console.log('[useCardAnimation] Initializing animation', {
          sectionIndex,
          isHeroSection,
          timestamp: Date.now()
        });

        if (isHeroSection) {
          console.log('[useCardAnimation] Initializing master for hero section');
          animationController.initializeMaster();
        }

        console.log('[useCardAnimation] Registering section', sectionIndex);
        animationController.registerSection(sectionIndex, wrapper);

        isInitializedRef.current = true;
        console.log('[useCardAnimation] Animation initialized successfully', sectionIndex);
      } catch (error) {
        console.warn('Animation initialization failed:', error);
      }
    };

    // Дожидаемся загрузки шрифтов, чтобы SplitText корректно посчитал линии
    // const ready =
    //   typeof document !== 'undefined' && 'fonts' in document
    //     ? (document as Document & { fonts: FontFaceSet }).fonts.ready
    //     : Promise.resolve();

    // ready
    //   .catch(() => undefined)
    //   .finally(() => {
    //     requestAnimationFrame(initializeAnimation);
    //   });

    // Инициализируем сразу, без ожидания document.fonts.ready
    console.log('[useCardAnimation] Scheduling animation initialization via RAF');
    requestAnimationFrame(initializeAnimation);

    return () => {
      console.log('[useCardAnimation] Cleanup started', {
        sectionIndex,
        isInitialized: isInitializedRef.current
      });
      if (isInitializedRef.current) {
        animationController.cleanupSection(sectionIndex);
        isInitializedRef.current = false;
        console.log('[useCardAnimation] Cleanup completed', sectionIndex);
      }
    };
  }, [sectionIndex, isHeroSection]);

  return {
    wrapperRef,
    isReady: animationController.isReady(),
    activeCardIndex: animationController.getActiveCardIndex(),
  };
};
