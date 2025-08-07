import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';
import { initCardDeckScroll } from './cardDeckAnimation';
import { clearElementAnimations, getScrollTriggerSettings } from './sectionAnimationUtils';

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
  elementTimeline?.play();
  return initCardDeckScroll(wrapperElement, items);
}

/**
 * Инициализация обычной секции (index > 0)
 */
export function initRegularSection(
  wrapper: HTMLElement,
  sectionIndex: number,
): gsap.core.Timeline | null {
  const elementTimeline = createElementTimeline(wrapper, '[data-animate], [data-animation]');
  const { start, end } = getScrollTriggerSettings(sectionIndex);
  ScrollTrigger.create({
    trigger: wrapper,
    start,
    end,
    scroller: '#smooth-wrapper',
    id: `section-${sectionIndex}`,
    onEnter: () => {
      if (elementTimeline) {
        elementTimeline.progress(0).play();
      }
    },
    onEnterBack: () => {
      if (elementTimeline) {
        elementTimeline.progress(0).play();
      }
    },
    onLeave: () => {
      elementTimeline?.reverse();
    },
    onLeaveBack: () => {
      elementTimeline?.progress(0).pause();
      clearElementAnimations(wrapper);
    },
    markers: false,
  });
  return elementTimeline;
}
