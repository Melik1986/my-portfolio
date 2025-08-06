import { gsap } from 'gsap';

/**
 * Очищает анимации для всех элементов внутри секции
 * @param wrapper - элемент секции
 */
export function clearElementAnimations(wrapper: HTMLElement): void {
  const elements = wrapper.querySelectorAll('[data-animate], [data-animation]');
  elements.forEach((element) => {
    gsap.set(element, { clearProps: 'all' });
  });
}

/**
 * Получает параметры ScrollTrigger для секции
 * @param sectionIndex - индекс секции
 */
export function getScrollTriggerSettings(sectionIndex: number) {
  if (sectionIndex === 1) return { start: 'top 30%', end: 'bottom 80%' };
  if (sectionIndex === 2) return { start: 'top 40%', end: 'bottom 80%' };
  return { start: 'top 20%', end: 'bottom 80%' };
}