'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
import { GSDevTools } from 'gsap/GSDevTools';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(GSDevTools);

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
    console.log(`🚀 useCardAnimation hook initialized for section ${sectionIndex}`);

    const wrapper = wrapperRef.current;
    if (!wrapper || sectionIndex === null || sectionIndex === undefined) {
      console.warn(`❌ Section with index ${sectionIndex} not found or invalid`);
      return;
    }

    console.log(`✅ Found wrapper for section ${sectionIndex}:`, {
      wrapper: wrapper.id || wrapper.className,
      rect: wrapper.getBoundingClientRect(),
      children: wrapper.children.length,
      elementsWithAnimation: wrapper.querySelectorAll('[data-animation]').length,
    });

    // Для всех секций создаем индивидуальный ScrollTrigger
    if (sectionIndex !== 0) {
      console.log(`🏗️ Creating timeline for section ${sectionIndex}:`, {
        wrapper: wrapper.id || wrapper.className,
        wrapperRect: wrapper.getBoundingClientRect(),
      });
      elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement);
      console.log(`✅ Timeline created for section ${sectionIndex}:`, {
        timeline: elementTimelineRef.current,
        duration: elementTimelineRef.current?.duration(),
        paused: elementTimelineRef.current?.paused(),
        progress: elementTimelineRef.current?.progress(),
      });

      // Сохраняем инстанс ScrollTrigger для очистки
      let scrollTriggerInstance: ScrollTrigger | null = null;
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrapper,
        start: sectionIndex === 1 ? 'top 30%' : sectionIndex === 2 ? 'top 40%' : 'top 20%', // Анимация запускается, когда верх секции достигает 80% высоты вьюпорта
        end: 'bottom 80%', // Завершается, когда низ секции опускается до 20%
        once: false,
        onEnter: () => {
          console.log(`🎯 ScrollTrigger onEnter - Section ${sectionIndex}:`, {
            timeline: elementTimelineRef.current,
            timelinePaused: elementTimelineRef.current?.paused(),
            timelineProgress: elementTimelineRef.current?.progress(),
            timelineDuration: elementTimelineRef.current?.duration(),
            wrapper: wrapper.id || wrapper.className,
          });
          elementTimelineRef.current?.play();
          console.log(`▶️ Timeline play() called - Section ${sectionIndex}:`, {
            timelinePaused: elementTimelineRef.current?.paused(),
            timelineProgress: elementTimelineRef.current?.progress(),
          });
        },
        onEnterBack: () => {
          console.log(`🔄 ScrollTrigger onEnterBack - Section ${sectionIndex}:`, {
            timeline: elementTimelineRef.current,
            timelinePaused: elementTimelineRef.current?.paused(),
            timelineProgress: elementTimelineRef.current?.progress(),
          });
          elementTimelineRef.current?.play();
        },
        onLeave: () => {
          console.log(`⬆️ ScrollTrigger onLeave - Section ${sectionIndex}:`, {
            timeline: elementTimelineRef.current,
            timelinePaused: elementTimelineRef.current?.paused(),
            timelineProgress: elementTimelineRef.current?.progress(),
          });
          elementTimelineRef.current?.reverse();
        },
        onLeaveBack: () => {
          console.log(`⬇️ ScrollTrigger onLeaveBack - Section ${sectionIndex}:`, {
            timeline: elementTimelineRef.current,
            timelinePaused: elementTimelineRef.current?.paused(),
            timelineProgress: elementTimelineRef.current?.progress(),
          });
          // Сбрасываем timeline в начальное состояние и очищаем все стили
          if (elementTimelineRef.current) {
            elementTimelineRef.current.progress(0).pause();
            // Очищаем все inline стили, установленные GSAP, чтобы элементы вернулись к исходному состоянию
            const elements = wrapper?.querySelectorAll('[data-animate], [data-animation]');
            elements?.forEach((element) => {
              gsap.set(element, { clearProps: 'all' });
            });
          }
        },
        markers: true,
        scroller: '#smooth-wrapper',
        onRefresh: () => {
          console.log(`🔄 ScrollTrigger onRefresh - Section ${sectionIndex}`);
        },
        onUpdate: (self) => {
          console.log(`📊 ScrollTrigger onUpdate - Section ${sectionIndex}:`, {
            progress: self.progress,
            direction: self.direction,
            isActive: self.isActive,
          });
        },
      });

      GSDevTools.create({ animation: elementTimelineRef.current });

      console.log(`🎯 useCardAnimation setup completed for section ${sectionIndex}:`, {
        hasScrollTrigger: !!scrollTriggerInstance,
        hasTimeline: !!elementTimelineRef.current,
        timelineDuration: elementTimelineRef.current?.duration(),
        timelinePaused: elementTimelineRef.current?.paused(),
      });

      return () => {
        console.log(`🧹 Cleaning up section ${sectionIndex}`);
        if (scrollTriggerInstance) {
          console.log(`🗑️ Killing ScrollTrigger for section ${sectionIndex}`);
          scrollTriggerInstance.kill();
        }
        if (elementTimelineRef.current) {
          console.log(`🗑️ Killing timeline for section ${sectionIndex}`);
          elementTimelineRef.current.kill();
        }
      };
    }

    // --- HERO SECTION ---
    let observer: MutationObserver | null = null;
    let cleared = false;
    const initAnimation = () => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return false;
      const scrollSection = document.querySelector('.scroll-section');
      if (!scrollSection) return false;
      const wrapperElement = scrollSection.querySelector('.portfolio__wrapper') || scrollSection;
      const items = Array.from(wrapperElement.querySelectorAll('li')) as HTMLElement[];
      if (items.length === 0) return false;
      elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement);
      if (elementTimelineRef.current) {
        setTimeout(() => {
          elementTimelineRef.current?.play();
        }, 300);
      }
      const timeline = initScroll(
        wrapperElement as HTMLElement,
        items,
        direction,
        elementTimelineRef.current,
      );
      timelineRef.current = timeline;
      return true;
    };

    if (!initAnimation()) {
      observer = new MutationObserver(() => {
        if (cleared) return;
        if (initAnimation()) {
          observer?.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cleared = true;
      observer?.disconnect();
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
      onEnter: () => {
        console.log('onEnter for hero section');
        elementTimeline?.play();
      },
      onLeave: () => {
        console.log('onLeave for hero section');
        elementTimeline?.reverse();
      },
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
