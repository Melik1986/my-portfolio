import { gsap } from 'gsap';

/**
 * Получает адаптивные настройки анимации в зависимости от устройства
 */
function getResponsiveSettings() {
  return {
    mobile: {
      scrub: 0.5, // Более плавная прокрутка на мобильных
      duration: 0.3, // Быстрее анимации
      scale: 0.95, // Менее выраженный эффект масштабирования
      borderRadius: '8px', // Меньший радиус
      enableComplexAnimations: false, // Отключаем сложные эффекты
    },
    tablet: {
      scrub: 0.8,
      duration: 0.4,
      scale: 0.92,
      borderRadius: '9px',
      enableComplexAnimations: true,
    },
    desktop: {
      scrub: 1,
      duration: 0.5,
      scale: 0.9,
      borderRadius: '10px',
      enableComplexAnimations: true,
    },
  };
}

/**
 * Инициализация анимации колоды карт (Hero + остальные секции)
 * @param section - элемент секции (обёртка)
 * @param items - массив элементов карт
 * @returns gsap.core.Timeline
 */
export function initCardDeckScroll(section: HTMLElement, items: HTMLElement[]): gsap.core.Timeline {
  const settings = getResponsiveSettings();
  let timeline: gsap.core.Timeline;

  // Инициализация позиций карт
  items.forEach((item, index) => {
    if (index === 0) {
      gsap.set(item, { yPercent: 0, xPercent: 0, visibility: 'visible' });
    } else if (index <= 2) {
      gsap.set(item, { yPercent: 100, xPercent: 0, visibility: 'hidden' });
    } else {
      gsap.set(item, { yPercent: 0, xPercent: 100, visibility: 'hidden' });
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
        end: () => `+=${(items.length - 1) * 80}%`, // Короче для мобильных
        scrub: settings.mobile.scrub,
        invalidateOnRefresh: true,
        scroller: '#smooth-wrapper',
        markers: false,
        anticipatePin: 1, // Оптимизация для мобильных
      },
      defaults: { ease: 'power2.out' }, // Более мягкий easing
    });

    // Упрощенная анимация для мобильных
    items.forEach((item, index) => {
      if (index === 0) return;
      
      if (index > 0 && settings.mobile.enableComplexAnimations) {
        timeline.to(items[index - 1], {
          scale: settings.mobile.scale,
          borderRadius: settings.mobile.borderRadius,
        });
      }
      
      const property = index <= 2 ? 'yPercent' : 'xPercent';
      timeline.to(
        item,
        {
          [property]: 0,
          visibility: 'visible',
          duration: settings.mobile.duration,
        },
        '<',
      );
    });
  });

  // Планшеты (768px - 1024px)
  mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
    timeline = gsap.timeline({
      id: 'card-deck-timeline-tablet',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${(items.length - 1) * 90}%`,
        scrub: settings.tablet.scrub,
        invalidateOnRefresh: true,
        scroller: '#smooth-wrapper',
        markers: false,
      },
      defaults: { ease: 'power1.out' },
    });

    items.forEach((item, index) => {
      if (index === 0) return;
      
      if (index > 0) {
        timeline.to(items[index - 1], {
          scale: settings.tablet.scale,
          borderRadius: settings.tablet.borderRadius,
        });
      }
      
      const property = index <= 2 ? 'yPercent' : 'xPercent';
      timeline.to(
        item,
        {
          [property]: 0,
          visibility: 'visible',
          duration: settings.tablet.duration,
        },
        '<',
      );
    });
  });

  // Десктоп (больше 1024px)
  mm.add('(min-width: 1025px)', () => {
    timeline = gsap.timeline({
      id: 'card-deck-timeline-desktop',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${(items.length - 1) * 100}%`,
        scrub: settings.desktop.scrub,
        invalidateOnRefresh: true,
        scroller: '#smooth-wrapper',
        markers: false,
      },
      defaults: { ease: 'none' },
    });

  // Полная анимация для десктопа
    items.forEach((item, index) => {
      if (index === 0) return;
      
      if (index > 0) {
        timeline.to(items[index - 1], {
          scale: settings.desktop.scale,
          borderRadius: settings.desktop.borderRadius,
        });
      }
      
      const property = index <= 2 ? 'yPercent' : 'xPercent';
      timeline.to(
        item,
        {
          [property]: 0,
          visibility: 'visible',
          duration: settings.desktop.duration,
        },
        '<',
      );
    });
  });

  return timeline!;
}
