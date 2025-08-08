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
  // Исправляем перекрывающиеся настройки ScrollTrigger
  if (sectionIndex === 1) return { start: 'top 80%', end: 'bottom 20%' };
  if (sectionIndex === 2) return { start: 'top 80%', end: 'bottom 20%' };
  if (sectionIndex === 3) return { start: 'top 80%', end: 'bottom 20%' };
  if (sectionIndex === 4) return { start: 'top 80%', end: 'bottom 20%' };
  return { start: 'top 80%', end: 'bottom 5%' };
}
