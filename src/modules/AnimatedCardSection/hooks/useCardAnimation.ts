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

    // Только первая секция (index 0) создает ScrollTrigger для всей колоды
    if (sectionIndex !== 0) {
      // Создаем timeline для элементов с data-animate для остальных секций
      elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement);
      return;
    }

    // Функция для инициализации анимации (только для первой секции)
    const initAnimation = () => {
      const smoother = ScrollSmoother.get();
      if (!smoother) {
        return false; // ScrollSmoother еще не готов
      }

      // Ищем scroll-section, затем wrapper и все items
      const scrollSection = document.querySelector('.scroll-section');
      if (!scrollSection) return false;
      
      const wrapperElement = scrollSection.querySelector('.portfolio__wrapper') || scrollSection;
      const items = Array.from(wrapperElement.querySelectorAll('li')) as HTMLElement[];
      if (items.length === 0) return false;

      // Создаем timeline для элементов с data-animate первой секции
      elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement);

      const timeline = initScroll(
        wrapperElement as HTMLElement, // trigger - scroll-section wrapper
        items,
        direction,
        elementTimelineRef.current,
      );
      timelineRef.current = timeline;
      return true;
    };

    // Пытаемся инициализировать сразу
    if (initAnimation()) {
      return;
    }

    // Если ScrollSmoother не готов, ждем и повторяем попытку
    const checkInterval = setInterval(() => {
      if (initAnimation()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Очистка при размонтировании
    return () => {
      clearInterval(checkInterval);
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
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

  items.forEach((item, index) => {
    // Масштабируем текущий элемент и добавляем border-radius
    timeline.to(item, {
      scale: 0.9,
      borderRadius: '10px',
    });

    // Показываем следующий элемент (если он есть)
    if (items[index + 1]) {
      direction == 'horizontal'
        ? timeline.to(
            items[index + 1],
            {
              xPercent: 0,
            },
            '<',
          )
        : timeline.to(
            items[index + 1],
            {
              yPercent: 0,
            },
            '<',
          );
    }
  });
  return timeline;
}
