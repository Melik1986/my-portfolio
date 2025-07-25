'use client';

import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section.types';
import './Section.module.scss';
import { useRef } from 'react';

export function AnimatedCardSection({
  id,
  title,
  children,
  direction = 'vertical',
}: AnimatedCardSectionProps) {
  const contentTimelinesRef = useRef(new Map<number, gsap.core.Timeline>());
  const { wrapperRef } = useCardAnimation({
    direction,
    contentTimelinesRef,
  });

  return (
    <section ref={wrapperRef} className="portfolio__section" id={id}>
      <h2 className="portfolio__title">{title}</h2>
      <ul className="portfolio__wrapper">
        <li className="portfolio__item">{children}</li>
      </ul>
    </section>
  );
}
