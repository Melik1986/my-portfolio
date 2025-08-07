'use client';

import React from 'react';
import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section';
import styles from './Section.module.scss';

export function AnimatedCardSection({
  id,
  children,
  direction = 'vertical',
  sectionIndex,
}: Omit<AnimatedCardSectionProps, 'contentTimelinesRef'>) {
  const { wrapperRef } = useCardAnimation({
    direction,
    sectionIndex,
  });

  return (
    <li
      ref={wrapperRef}
      className={styles.portfolio__item}
      id={id}
      data-section-index={sectionIndex}
    >
      {children}
    </li>
  );
}
