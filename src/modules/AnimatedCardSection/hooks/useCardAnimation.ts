'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationProps } from '@/types/gsap.types';

type MutableRef<T> = { current: T | null };

gsap.registerPlugin(ScrollTrigger);

/**
 * Хук для анимации переключения между секциями в колоде карт
 * Отвечает только за ScrollTrigger переходов между секциями
 */
export const useCardAnimation = (
  props: AnimationProps & {
    contentTimelinesRef: MutableRef<Map<number, gsap.core.Timeline>>;
  },
) => {
  const { direction = 'vertical', contentTimelinesRef } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(0) as MutableRef<number>;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const items = wrapper.querySelectorAll('.portfolio__item');
    if (items.length === 0) return;
    const mainTimeline = createSectionTimeline({
      section: wrapper,
      animation: { items, direction, contentTimelinesRef },
      activeIndexRef,
    });
    return () => {
      mainTimeline.scrollTrigger?.kill();
      mainTimeline.kill();
    };
  }, [direction, contentTimelinesRef]);

  return { wrapperRef };
};

interface AnimationConfig {
  items: NodeListOf<Element>;
  direction: 'horizontal' | 'vertical';
  contentTimelinesRef: MutableRef<Map<number, gsap.core.Timeline>>;
}

function createSectionTimeline(config: {
  section: HTMLDivElement;
  animation: AnimationConfig;
  activeIndexRef: MutableRef<number>;
}): gsap.core.Timeline {
  const { section, animation, activeIndexRef } = config;
  const { items, direction, contentTimelinesRef } = animation;
  const onSectionUpdate = getOnSectionUpdate({
    activeIndexRef,
    contentTimelinesRef,
    numItems: items.length,
  });
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: onSectionUpdate,
    },
    defaults: { ease: 'none' },
  });
  addSectionTransitions(timeline, { items, direction });
  return timeline;
}

function getOnSectionUpdate(config: {
  activeIndexRef: MutableRef<number>;
  contentTimelinesRef: MutableRef<Map<number, gsap.core.Timeline>>;
  numItems: number;
}) {
  const { activeIndexRef, contentTimelinesRef, numItems } = config;
  return (self: ScrollTrigger) => {
    const progress = self.progress;
    const newIndex = Math.floor(progress * (numItems - 1) + 0.5);
    if (newIndex !== activeIndexRef.current) {
      if (contentTimelinesRef.current) {
        const prevTimeline = contentTimelinesRef.current.get(activeIndexRef.current!);
        if (prevTimeline) prevTimeline.pause(0);
        const nextTimeline = contentTimelinesRef.current.get(newIndex);
        if (nextTimeline) nextTimeline.play(0);
      }
      activeIndexRef.current = newIndex;
    }
  };
}

function addSectionTransitions(
  timeline: gsap.core.Timeline,
  config: Pick<AnimationConfig, 'items' | 'direction'>,
): void {
  const { items, direction } = config;
  items.forEach((item, index) => {
    if (index < items.length - 1) {
      timeline.to(item, { scale: 0.9, borderRadius: '14px' });
      if (direction === 'horizontal') {
        timeline.to(items[index + 1], { xPercent: 0 }, '<');
      } else {
        timeline.to(items[index + 1], { yPercent: 0 }, '<');
      }
    }
  });
}
