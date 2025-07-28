'use client';

import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section.types';
import styles from './Section.module.scss';
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
    <section ref={wrapperRef} className={styles.portfolio__section} id={id}>
      <h2 className={styles.portfolio__title}>{title}</h2>
      <ul className={styles.portfolio__wrapper}>
        <li className={styles.portfolio__item}>{children}</li>
      </ul>
    </section>
  );
}
