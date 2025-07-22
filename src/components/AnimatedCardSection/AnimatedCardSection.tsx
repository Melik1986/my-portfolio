import { ReactNode } from 'react';
import { AnimatedCardSectionProps } from '@/types/animated-card-section.types';
import { useCardAnimation } from './hooks/useCardAnimation';
import './Section.module.scss';

export default function AnimatedCardSection(props: AnimatedCardSectionProps) {
  const {
    id,
    title,
    children,
    direction = 'vertical',
    activationThreshold = 0.3,
    onActivate,
    onDeactivate,
  } = props;
  const { sectionRef, contentRef } = useCardAnimation({
    direction,
    activationThreshold,
    onActivate,
    onDeactivate,
  });

  return (
    <section ref={sectionRef} className="portfolio__section" id={id}>
      <div ref={contentRef} className="portfolio__wrapper">
        {children}
      </div>
    </section>
  );
}
