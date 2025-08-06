import { gsap } from 'gsap';

/**
 * Инициализация анимации колоды карт (Hero + остальные секции)
 * @param section - элемент секции (обёртка)
 * @param items - массив элементов карт
 * @returns gsap.core.Timeline
 */
export function initCardDeckScroll(section: HTMLElement, items: HTMLElement[]): gsap.core.Timeline {
  items.forEach((item, index) => {
    if (index === 0) {
      gsap.set(item, { yPercent: 0, xPercent: 0, visibility: 'visible' });
    } else if (index <= 2) {
      gsap.set(item, { yPercent: 100, xPercent: 0, visibility: 'hidden' });
    } else {
      gsap.set(item, { yPercent: 0, xPercent: 100, visibility: 'hidden' });
    }
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${(items.length - 1) * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      scroller: '#smooth-wrapper',
      markers: true,
    },
    defaults: { ease: 'none' },
  });

  items.forEach((item, index) => {
    if (index === 0) return;
    if (index > 0) {
      timeline.to(items[index - 1], {
        scale: 0.9,
        borderRadius: '10px',
      });
    }
    const property = index <= 2 ? 'yPercent' : 'xPercent';
    timeline.to(
      item,
      {
        [property]: 0,
        visibility: 'visible',
        duration: 0.5,
      },
      '<'
    );
  });

  return timeline;
}