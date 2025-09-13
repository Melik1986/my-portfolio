import { gsap } from 'gsap';
import { ensureGSAPRegistered } from '@/lib/gsap/core/GSAPInitializer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

ensureGSAPRegistered();

// Проверка на мобильное устройство
const isMobile = (): boolean => {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
};

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

    // Получаем индекс секции из data-атрибута
    const sectionIndex = parseFloat(item.getAttribute('data-section-index') || String(index));

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
        // Вперёд: активируем текущую карточку с правильным индексом
        onStart: () => onProgressUpdate?.(sectionIndex, endProgress),
        // Назад: возвращаем активность предыдущей карточке
        onReverseComplete: () => {
          const prevIndex = parseFloat(
            items[index - 1]?.getAttribute('data-section-index') || String(index - 1),
          );
          onProgressUpdate?.(prevIndex, startProgress);
        },
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

// Дожидается появления pin-spacer рядом с секцией
function waitForPinSpacer(section: HTMLElement, timeoutMs = 1000): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const spacer = section.parentElement && section.parentElement.querySelector('.pin-spacer');
      if (spacer) {
        resolve();
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

/**
 * Инициализация анимации колоды карт (Hero + остальные секции)
 * @param section - элемент секции (обёртка)
 * @param items - массив элементов карт
 * @param onCardActivate - callback для синхронизации с элементными анимациями
 * @returns gsap.core.Timeline
 */
function initPositions(items: HTMLElement[], verticalOnly = false): void {
  items.forEach((item, index) => {
    if (verticalOnly) {
      if (index === 0) {
        gsap.set(item, { yPercent: 0, xPercent: 0, opacity: 1, zIndex: 10 });
      } else {
        gsap.set(item, { yPercent: 100, xPercent: 0, opacity: 0, zIndex: 1 });
      }
      return;
    }

    // Смешанная раскладка по умолчанию (первые 3 — вертикаль, остальные — справа)
    if (index === 0) {
      gsap.set(item, { yPercent: 0, xPercent: 0, opacity: 1, zIndex: 10 });
    } else if (index <= 2) {
      gsap.set(item, { yPercent: 100, xPercent: 0, opacity: 0, zIndex: 1 });
    } else {
      gsap.set(item, { yPercent: 0, xPercent: 100, opacity: 0, zIndex: 1 });
    }
  });
}

function createMobileTimeline(
  section: HTMLElement,
  items: HTMLElement[],
  onCardActivate?: ElementAnimationCallback,
): gsap.core.Timeline {
  // Вертикальная раскладка и анимация только по Y на мобилке
  initPositions(items, true);
  const tl = gsap.timeline({
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
  createCardAnimation(tl, items, onCardActivate, { verticalOnly: true });
  waitForPinSpacer(section).then(() => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
  return tl;
}

function createDesktopTimeline(
  section: HTMLElement,
  items: HTMLElement[],
  onCardActivate?: ElementAnimationCallback,
): gsap.core.Timeline {
  initPositions(items, false);
  const tl = gsap.timeline({
    id: 'card-deck-timeline-desktop',
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${(items.length - 1) * 100}%`,
      // Уменьшаем scrub для мобильных - делает скролл менее чувствительным
      scrub: isMobile() ? 0.2 : 1,
      invalidateOnRefresh: true,
      // Снапим прогресс к ближайшей карточке (устраняет недоезд последней на 768–1023)
      snap: {
        snapTo: (value: number) => {
          const steps = Math.max(1, items.length - 1);
          const step = 1 / steps;
          return Math.round(value / step) * step;
        },
        // Увеличиваем duration и delay для мобильных устройств для более сильного магнита
        duration: isMobile() ? 1.8 : 1,
        delay: isMobile() ? 1 : 0,
        ease: 'power1.inOut',
        // Уменьшаем инерцию на мобильных для более быстрой остановки
        inertia: isMobile() ? false : true,
      },
      markers: false,
    },
  });
  createCardAnimation(tl, items, onCardActivate);
  waitForPinSpacer(section).then(() => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });
  return tl;
}

export function initCardDeckScroll(
  section: HTMLElement,
  items: HTMLElement[],
  onCardActivate?: ElementAnimationCallback,
): gsap.core.Timeline {
  let timeline: gsap.core.Timeline;
  const mm = gsap.matchMedia();

  mm.add('(max-width: 767px)', () => {
    // На мобильных устройствах пересчитываем количество элементов динамически
    const currentItems = Array.from(
      section.querySelectorAll(':scope > ul.portfolio__list > li'),
    ) as HTMLElement[];
    timeline = createMobileTimeline(
      section,
      currentItems.length > 0 ? currentItems : items,
      onCardActivate,
    );
    return () => timeline.kill();
  });

  mm.add('(min-width: 768px)', () => {
    timeline = createDesktopTimeline(section, items, onCardActivate);
    return () => timeline.kill();
  });

  // Дополнительно реагируем на смену ориентации, чтобы пересчитать триггеры
  mm.add('(orientation: landscape)', () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
    return () => {};
  });

  mm.add('(orientation: portrait)', () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
    return () => {};
  });

  return timeline!;
}
