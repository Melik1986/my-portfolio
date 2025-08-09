import { gsap } from 'gsap';
import { cleanupSplitTextInstances } from '@/lib/gsap/hooks/useGsap';

import type { ScrollTriggerSettings } from '../types/animated-card-section';

/**
 * Очищает анимации для всех элементов внутри секции
 * @param wrapper - элемент секции
 */
export function clearElementAnimations(wrapper: HTMLElement): void {
  // Очищаем SplitText экземпляры перед очисткой GSAP свойств
  cleanupSplitTextInstances(wrapper);
  
  const elements = wrapper.querySelectorAll('[data-animate], [data-animation]');
  elements.forEach((element) => {
    gsap.set(element, { clearProps: 'all' });
  });
}

/**
 * Получает настройки ScrollTrigger для секций с адаптивностью
 * @param sectionIndex - индекс секции
 * @returns настройки ScrollTrigger
 */
export function getScrollTriggerSettings(sectionIndex: number): ScrollTriggerSettings {
  // Базовые настройки - одинаковые для всех секций
  const baseSettings: ScrollTriggerSettings = {
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: false,
  };

  // Специфичные настройки только для первых секций на мобильных
  if (sectionIndex === 1) {
    return {
      ...baseSettings,
      start: 'top 90%',
      end: 'bottom 10%',
    };
  }

  return baseSettings;
}
