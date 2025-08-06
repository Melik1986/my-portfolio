'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';
import { initHeroSection, initRegularSection } from '../utils/sectionInitializers';
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
    let timeline: gsap.core.Timeline | null = null;
    if (sectionIndex === 0) {
      timeline = initHeroSection(wrapper);
    } else {
      timeline = initRegularSection(wrapper, sectionIndex);
    }
    return () => {
      timeline?.kill();
      if (sectionIndex !== 0) {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === wrapper) trigger.kill();
        });
      }
    };
  }, [sectionIndex]);
  return { wrapperRef };
};
