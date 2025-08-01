'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';

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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || sectionIndex === null) return;

    const smoother = ScrollSmoother.get();
    if (!smoother) {
      console.warn(
        'ScrollSmoother не инициализирован. Убедитесь, что useScrollSmoother вызван на уровне приложения.',
      );
      return;
    }

    // В нашей архитектуре wrapper уже является секцией с классом scroll-section
    const section = wrapper;
    
    // Ищем родительский ul (portfolio__wrapper) и получаем все li элементы
    const parentWrapper = section.parentElement;
    if (!parentWrapper) return;
    
    const items = parentWrapper.querySelectorAll('li.scroll-section');
    if (items.length === 0) return;


    const timeline = initScroll(section as HTMLElement, items, direction);
    timelineRef.current = timeline;

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [direction, sectionIndex]);

  return { wrapperRef };
};


function initScroll(
  section: HTMLElement,
  items: NodeListOf<Element>,
  direction: 'horizontal' | 'vertical',
): gsap.core.Timeline {
  // Initial states -
  items.forEach((item, index) => {
    if (index !== 0) {
      if (direction === 'horizontal') {
        gsap.set(item, { xPercent: 100 });
      } else {
        gsap.set(item, { yPercent: 100 });
      }
    }
  });

  // Создаем timeline
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      scroller: '#smooth-wrapper',
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
