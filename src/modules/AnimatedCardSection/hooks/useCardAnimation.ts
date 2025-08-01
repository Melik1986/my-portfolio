'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * Хук для анимации переключения между секциями в колоде карт
 * Точная копия оригинального алгоритма: один timeline с ScrollTrigger на секцию
 */
export const useCardAnimation = (
  props: AnimationProps & {
    sectionIndex?: number | null;
  },
) => {
  const { direction = 'vertical', sectionIndex } = props;
  const wrapperRef = useRef<HTMLLIElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const elementTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || sectionIndex === null || sectionIndex === undefined) return;

    const smoother = ScrollSmoother.get();
    if (!smoother) {
      console.warn(
        'ScrollSmoother не инициализирован. Убедитесь, что useScrollSmoother вызван на уровне приложения.',
      );
      return;
    }

    // В нашей архитектуре wrapper - это li элемент внутри ul с классом scroll-section
    const section = wrapper;
    
    // Ищем родительский ul (portfolio__wrapper) и получаем все li элементы
    const parentWrapper = section.parentElement;
    if (!parentWrapper || !parentWrapper.children.length) return;
    const items = Array.from(parentWrapper.children) as HTMLElement[];
    if (items.length === 0 || sectionIndex >= items.length) return;

    // Создаем timeline для элементов с data-animate один раз
    elementTimelineRef.current = createElementTimeline(section as HTMLElement);
    
    const timeline = initScroll(section as HTMLElement, items, direction, elementTimelineRef.current);
    timelineRef.current = timeline;

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      // Очистка при размонтировании
      if (elementTimelineRef.current) {
        elementTimelineRef.current.kill();
      }
    };
  }, [direction, sectionIndex]);

  return { wrapperRef };
};


function initScroll(
  section: HTMLElement,
  items: HTMLElement[],
  direction: 'horizontal' | 'vertical',
  elementTimeline?: gsap.core.Timeline | null,
): gsap.core.Timeline {
  // Инициализация начальных состояний
  const property = direction === 'horizontal' ? 'xPercent' : 'yPercent';
  items.forEach((item, index) => {
    if (index !== 0) gsap.set(item, { [property]: 100 });
  });

  // Создание timeline с ScrollTrigger
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      scroller: '#smooth-wrapper',
      onEnter: () => elementTimeline?.play(),
      onLeave: () => elementTimeline?.reverse(),
    },
    defaults: { ease: 'none' },
  });


  items.forEach((_, index) => {
    if (index === items.length - 1) return;
    if (direction === "horizontal") {
      timeline.to(
        items[index + 1],
        {
          xPercent: 0,
        },
        "<"
      );
    } else {
      timeline.to(
        items[index + 1],
        {
          yPercent: 0,
        },
        "<"
      );
    }
  });

  return timeline;
}
