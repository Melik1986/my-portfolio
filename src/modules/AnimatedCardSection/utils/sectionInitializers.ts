import { gsap } from 'gsap';
import { createElementTimeline } from '@/lib/gsap/hooks/useElementTimeline';
import { initCardDeckScroll } from './cardDeckAnimation';
import { elementTimelineRegistry, clearElementAnimations } from './sectionAnimationUtils';

/**
 * Инициализация Hero-секции (index 0)
 */
export function initHeroSection(wrapper: HTMLElement): gsap.core.Timeline | null {
  const scrollSection = document.querySelector('.scroll-section');
  if (!scrollSection) return null;
  const wrapperElement = (scrollSection.querySelector('.portfolio__wrapper') ||
    scrollSection) as HTMLElement;
  const items = Array.from(wrapperElement.querySelectorAll('li')) as HTMLElement[];
  if (items.length === 0) return null;

  const elementTimeline = createElementTimeline(wrapper, '[data-animate], [data-animation]');
  // Регистрируем timeline первой карточки
  elementTimelineRegistry.registerTimeline(0, elementTimeline);
  // Очищаем стили после полного реверса (уход карточки назад)
  elementTimeline.eventCallback('onReverseComplete', () => {
    clearElementAnimations(wrapper);
  });

  const master = initCardDeckScroll(wrapperElement, items, (cardIndex) => {
    elementTimelineRegistry.updateActiveCard(cardIndex);
  });
  elementTimelineRegistry.setMasterTimeline(master);

  // Инициализируем активную карточку (Hero) при загрузке
  elementTimelineRegistry.updateActiveCard(0);

  return master;
}

/**
 * Инициализация обычной секции (index > 0)
 */
export function initRegularSection(
  wrapper: HTMLElement,
  sectionIndex: number,
): gsap.core.Timeline | null {
  const elementTimeline = createElementTimeline(wrapper, '[data-animate], [data-animation]');
  // Регистрируем timeline для текущей секции по её индексу
  elementTimelineRegistry.registerTimeline(sectionIndex, elementTimeline);

  // Управление проигрыванием/реверсом выполняется через master timeline
  // Добавляем очистку стилей после полного реверса (уход секции назад)
  elementTimeline.eventCallback('onReverseComplete', () => {
    clearElementAnimations(wrapper);
  });

  return elementTimeline;
}
