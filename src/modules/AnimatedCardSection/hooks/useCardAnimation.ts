'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { AnimationProps } from '@/lib/gsap/types/gsap.types';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
gsap.registerPlugin(ScrollTrigger);

/**
 * Хук для анимации переключения между секциями в одной колоде карт
 * Hero-секция статична, остальные собираются на неё
 * Направление меняется после SkillsSection (index 2)
 */
export const useCardAnimation = (
  props: AnimationProps & {
    sectionIndex?: number | null;
    onDirectionChange?: (direction: 'horizontal' | 'vertical') => void;
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

    let observer: MutationObserver | null = null;
    let cleared = false;
    
    const initAnimation = () => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return false;
      
      if (sectionIndex === 0) {
        // Hero section - статична, создаем основной timeline для всей колоды
        const scrollSection = document.querySelector('.scroll-section');
        if (!scrollSection) return false;
        
        const wrapperElement = scrollSection.querySelector('.portfolio__wrapper') || scrollSection;
        const items = Array.from(wrapperElement.querySelectorAll('li')) as HTMLElement[];
        
        if (items.length === 0) return false;
        
        // Создаем timeline для внутренних анимаций Hero
        elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement, '[data-animate], [data-animation]');
        
        // Запускаем внутренние анимации Hero сразу при загрузке
        elementTimelineRef.current?.play();
        
        // Создаем основной timeline для переключения всех карт в колоде
        const timeline = initCardDeckScroll(wrapperElement, items);
        timelineRef.current = timeline;
        return true;
      } else {
        // Остальные секции - анимации запускаются по скроллу
        elementTimelineRef.current = createElementTimeline(wrapper as HTMLElement, '[data-animate], [data-animation]');
        
        // Создаем ScrollTrigger для запуска анимаций по скроллу
        ScrollTrigger.create({
          trigger: wrapper,
          start: sectionIndex === 1 ? 'top 30%' : sectionIndex === 2 ? 'top 40%' : 'top 20%',
          end: 'bottom 80%',
          scroller: '#smooth-wrapper',
          onEnter: () => {
            console.log(`🎯 ScrollTrigger onEnter - Section ${sectionIndex}`);
            elementTimelineRef.current?.play();
          },
          onEnterBack: () => {
            console.log(`🔄 ScrollTrigger onEnterBack - Section ${sectionIndex}`);
            elementTimelineRef.current?.play();
          },
          onLeave: () => {
            console.log(`⬆️ ScrollTrigger onLeave - Section ${sectionIndex}`);
            elementTimelineRef.current?.reverse();
          },
          onLeaveBack: () => {
            console.log(`⬇️ ScrollTrigger onLeaveBack - Section ${sectionIndex}`);
            elementTimelineRef.current?.progress(0).pause();
            const elements = wrapper.querySelectorAll('[data-animate], [data-animation]');
            elements?.forEach((element) => {
              gsap.set(element, { clearProps: 'all' });
            });
          },
          markers: true,
        });
        return true;
      }
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
      
      // Очистка для Hero-секции
      if (sectionIndex === 0 && timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      
      // Очистка для обычных секций
      if (sectionIndex !== 0) {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === wrapper) {
            trigger.kill();
          }
        });
      }
      
      if (elementTimelineRef.current) {
        elementTimelineRef.current.kill();
        elementTimelineRef.current = null;
      }
    };
  }, [direction, sectionIndex]);

  return { wrapperRef };
};

function initCardDeckScroll(
  section: HTMLElement,
  items: HTMLElement[],
): gsap.core.Timeline {
  // Инициализация начальных состояний для всей колоды карт
  // Hero (index 0) статична, остальные начинают снизу (yPercent: 100)
  // После SkillsSection (index 2) направление меняется на horizontal
  items.forEach((item, index) => {
    if (index === 0) {
      // Hero статична и видима
      gsap.set(item, { yPercent: 0, xPercent: 0, visibility: 'visible' });
    } else if (index <= 2) {
      // About, Skills - вертикальное направление, скрыты до активации
      gsap.set(item, { yPercent: 100, xPercent: 0, visibility: 'hidden' });
    } else {
      // Projects, Gallery - горизонтальное направление, полностью скрыты
      gsap.set(item, { yPercent: 0, xPercent: 100, visibility: 'hidden' });
    }
  });

  // Создание timeline с ScrollTrigger для всей колоды
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${(items.length - 1) * 100}%`, // -1 потому что Hero статична
      scrub: 1,
      invalidateOnRefresh: true,
      scroller: '#smooth-wrapper',
      markers: true,
    },
    defaults: { ease: 'none' },
  });

  // Анимация переключения карт в колоде
  items.forEach((item, index) => {
    if (index === 0) return; // Hero статична, пропускаем
    
    // Масштабируем предыдущий элемент
    if (index > 0) {
      timeline.to(items[index - 1], {
        scale: 0.9,
        borderRadius: '10px',
      });
    }

    // Показываем текущий элемент
    const property = index <= 2 ? 'yPercent' : 'xPercent'; // Меняем направление после SkillsSection
    timeline.to(
      item,
      {
        [property]: 0,
        visibility: 'visible', // Делаем карточку видимой при активации
      },
      '<',
    );
  });
  
  return timeline;
}
