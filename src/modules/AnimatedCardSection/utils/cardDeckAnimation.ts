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
  options?: { verticalOnly?: boolean },
): void {
  items.forEach((item, index) => {
    if (index === 0) return;

    const startProgress = (index - 1) / (items.length - 1);
    const endProgress = index / (items.length - 1);

    // Ослабляем предыдущую карточку визуально
    timeline.to(items[index - 1], {
      scale: 0.9,
    });

    const property = options?.verticalOnly ? 'yPercent' : index <= 2 ? 'yPercent' : 'xPercent';
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
  console.log('[cardDeckAnimation] initCardDeckScroll started', {
    trigger: section?.tagName,
    itemsCount: items.length,
    timestamp: Date.now()
  });

  if (!section || items.length === 0) {
    console.error('[cardDeckAnimation] Invalid parameters', {
      hasTrigger: !!section,
      itemsLength: items.length
    });
    throw new Error('Invalid trigger or items for card deck animation');
  }

  let timeline: gsap.core.Timeline;

  // Инициализация позиций карт
  console.log('[cardDeckAnimation] Setting initial positions for cards');
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
  console.log('[cardDeckAnimation] Setting up gsap.matchMedia');
  const mm = gsap.matchMedia();

  // Мобильные устройства (до 768px)
  mm.add('(max-width: 767px)', () => {
    console.log('[cardDeckAnimation] Creating mobile timeline', {
      itemsCount: items.length,
      triggerElement: section.tagName
    });

    // [TEST] Отключено мобильное переопределение направления: используем смешанную раскладку как на десктопе
    // Позиции не переинициализируем: сохраняем стартовые позиции (смешанная раскладка)
    // items.forEach((item, index) => {
    //   if (index === 0) {
    //     gsap.set(item, { yPercent: 0, xPercent: 0, opacity: 1, zIndex: 10 });
    //   } else {
    //     gsap.set(item, { yPercent: 100, xPercent: 0, opacity: 0, zIndex: 1 });
    //   }
    // });

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
        onUpdate: (self) => {
          console.log('[cardDeckAnimation] Mobile ScrollTrigger progress:', self.progress);
        },
        onToggle: (self) => {
          console.log('[cardDeckAnimation] Mobile ScrollTrigger toggled:', {
            isActive: self.isActive,
            direction: self.direction
          });
        }
      },
    });

    // Диагностика: используем смешанную раскладку на мобилках для проверки багов порядка/скролла
    // eslint-disable-next-line no-console
    console.debug('[cardDeckAnimation] Mobile override disabled: using mixed layout for testing');

    // Было: createCardAnimation(timeline, items, onCardActivate, { verticalOnly: true });
    console.log('[cardDeckAnimation] Creating mobile card animation');
    createCardAnimation(timeline, items, onCardActivate);

    // ensure correct measurements after init
    console.log('[cardDeckAnimation] Refreshing mobile ScrollTrigger');
    ScrollTrigger.refresh();

    console.log('[cardDeckAnimation] Mobile timeline created successfully');
    // cleanup for this media query
    return () => {
      console.log('[cardDeckAnimation] Cleaning up mobile timeline');
      if (timeline) {
        timeline.kill();
      }
    };
  });

  // Планшеты и десктоп (768px и больше)
  mm.add('(min-width: 768px)', () => {
    console.log('[cardDeckAnimation] Creating desktop timeline', {
      itemsCount: items.length,
      triggerElement: section.tagName
    });

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
        onUpdate: (self) => {
          console.log('[cardDeckAnimation] Desktop ScrollTrigger progress:', self.progress);
        },
        onToggle: (self) => {
          console.log('[cardDeckAnimation] Desktop ScrollTrigger toggled:', {
            isActive: self.isActive,
            direction: self.direction
          });
        }
      },
    });

    console.log('[cardDeckAnimation] Creating desktop card animation');
    createCardAnimation(timeline, items, onCardActivate);

    // ensure correct measurements after init
    console.log('[cardDeckAnimation] Refreshing desktop ScrollTrigger');
    ScrollTrigger.refresh();

    console.log('[cardDeckAnimation] Desktop timeline created successfully');
    // cleanup for this media query
    return () => {
      console.log('[cardDeckAnimation] Cleaning up desktop timeline');
      if (timeline) {
        timeline.kill();
      }
    };
  });

  console.log('[cardDeckAnimation] initCardDeckScroll completed');
  return timeline!;
}
