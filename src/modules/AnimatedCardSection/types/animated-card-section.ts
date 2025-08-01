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
