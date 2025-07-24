'use client';

import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '../../types/animated-card-section.types';
import './Section.module.scss';

export default function AnimatedCardSection({
  id,
  title,
  children,
  direction = 'vertical',
}: AnimatedCardSectionProps) {
  const { sectionRef, contentRef } = useCardAnimation({
    direction,
  });

  return (
    <section ref={sectionRef} className="portfolio__section" id={id}>
      <h2 className="portfolio__title">{title}</h2>
      <div ref={contentRef} className="portfolio__wrapper">
        {children}
      </div>
    </section>
  );
}
