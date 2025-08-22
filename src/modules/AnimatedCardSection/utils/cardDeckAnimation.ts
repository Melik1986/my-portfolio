import { gsap } from 'gsap';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

ensureGSAPRegistered();

/**
 * Callback для синхронизации анимаций элементов с master timeline
 */
type ElementAnimationCallback = (cardIndex: number, progress: number) => void;

/**
 * Создает анимацию для группы элементов с поддержкой callback'ов
 */
function createCardAnimation(
  timeline: gsap.core.Timeline,
  items: HTMLElement[],
  onProgressUpdate?: ElementAnimationCallback,
): void {
  items.forEach((item, index) => {
    if (index === 0) return;

    const startProgress = (index - 1) / (items.length - 1);
    const endProgress = index / (items.length - 1);

    // Ослабляем предыдущую карточку визуально
    timeline.to(items[index - 1], {
      scale: 0.9,
    });

    const property = index <= 2 ? 'yPercent' : 'xPercent';
    timeline.to(
      item,
      {
        [property]: 0,
        opacity: 1,
        zIndex: 10,
        // Вперёд: активируем текущую карточку
        onStart: () => onProgressUpdate?.(index, endProgress),
        // Назад: возвращаем активность предыдущей карточке
        onReverseComplete: () => onProgressUpdate?.(index - 1, startProgress),
      },
      '<',
    );

    // Скрываем предыдущую карточку
    timeline.to(
      items[index - 1],
      {
        opacity: 0.3,
        zIndex: 1,
      },
      '<',
    );
  });
}

/**
 * Инициализация анимации колоды карт (Hero + остальные секции)
 * @param section - элемент секции (обёртка)
 * @param items - массив элементов карт
 * @param onCardActivate - callback для синхронизации с элементными анимациями
 * @returns gsap.core.Timeline
 */
export function initCardDeckScroll(
  section: HTMLElement,
  items: HTMLElement[],
  onCardActivate?: ElementAnimationCallback,
): gsap.core.Timeline {
  let timeline: gsap.core.Timeline;

  // Инициализация позиций карт
  items.forEach((item, index) => {
    if (index === 0) {
      gsap.set(item, { yPercent: 0, xPercent: 0, opacity: 1, zIndex: 10 });
    } else if (index <= 2) {
      gsap.set(item, { yPercent: 100, xPercent: 0, opacity: 0, zIndex: 1 });
    } else {
      gsap.set(item, { yPercent: 0, xPercent: 100, opacity: 0, zIndex: 1 });
    }
  });

  // Адаптивные настройки с gsap.matchMedia()
  const mm = gsap.matchMedia();

  // Мобильные устройства (до 768px)
  mm.add('(max-width: 767px)', () => {
    timeline = gsap.timeline({
      id: 'card-deck-timeline-mobile',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${(items.length - 1) * 100}%`,
        scrub: 0.5,
        invalidateOnRefresh: true,
        markers: false,
      },
    });

    createCardAnimation(timeline, items, onCardActivate);

    // ensure correct measurements after init
    ScrollTrigger.refresh();

    // cleanup for this media query
    return () => {
      if (timeline) {
        timeline.kill();
      }
    };
  });

  // Планшеты и десктоп (768px и больше)
  mm.add('(min-width: 768px)', () => {
    timeline = gsap.timeline({
      id: 'card-deck-timeline-desktop',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${(items.length - 1) * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false,
      },
    });

    createCardAnimation(timeline, items, onCardActivate);

    // ensure correct measurements after init
    ScrollTrigger.refresh();

    // cleanup for this media query
    return () => {
      if (timeline) {
        timeline.kill();
      }
    };
  });

  return timeline!;
}
