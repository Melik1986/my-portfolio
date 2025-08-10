'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';
import { initHeroSection, initRegularSection } from '../utils/sectionInitializers';
import { clearElementAnimations } from '../utils/sectionAnimationUtils';

gsap.registerPlugin(ScrollTrigger);

/**
 * Хук для анимации переключения между секциями в одной колоде карт
 */
export const useCardAnimation = (
  props: AnimationProps & {
    sectionIndex?: number | null;
  },
) => {
  const { sectionIndex } = props;
  const wrapperRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || sectionIndex === null || sectionIndex === undefined) return;

    // ✅ Проверяем готовность ScrollSmoother перед созданием ScrollTrigger
    const checkScrollSmootherReady = async () => {
      try {
        // Используем динамический импорт вместо require()
        const { ScrollSmoother } = await import('gsap/ScrollSmoother');
        return ScrollSmoother.get() !== null;
      } catch {
        return false;
      }
    };

    // Ждем готовности ScrollSmoother
    const waitForScrollSmoother = async () => {
      const isReady = await checkScrollSmootherReady();
      if (isReady) {
        initializeSection();
      } else {
        setTimeout(waitForScrollSmoother, 50);
      }
    };

    let timeline: gsap.core.Timeline | null = null;

    const initializeSection = () => {
      if (sectionIndex === 0) {
        timeline = initHeroSection(wrapper);
      } else {
        timeline = initRegularSection(wrapper, sectionIndex);
      }
    };

    // Запускаем инициализацию
    waitForScrollSmoother();

    return () => {
      timeline?.kill();
      if (sectionIndex !== 0) {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === wrapper) trigger.kill();
        });
        // Полная очистка анимаций и SplitText при размонтировании
        clearElementAnimations(wrapper);
      }
    };
  }, [sectionIndex]);

  return { wrapperRef };
};
