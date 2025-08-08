import { ReactElement } from 'react';
import { RefObject } from 'react';

export interface AnimatedCardSectionProps {
  id: string;
  title: string;
  children: ReactElement<AnimatedCardChildProps>;
  direction?: 'horizontal' | 'vertical';
  sectionIndex: number;
  contentTimelinesRef: RefObject<Map<number, gsap.core.Timeline>>;
}

export interface AnimatedCardChildProps {
  onTimelineReady?: (timeline: gsap.core.Timeline) => void;
}

// Общий интерфейс для типобезопасных настроек ScrollTrigger
export interface ScrollTriggerSettings {
  start: string;
  end: string;
  scrub?: boolean | number;
  anticipatePin?: number;
  refreshPriority?: number;
  fastScrollEnd?: boolean;
  trigger?: HTMLElement;
}
