'use client';

import React from 'react';
import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section';
import styles from './AnimatedCardSection.module.scss';

export function AnimatedCardSection({
  id,
  children,
  sectionIndex,
}: AnimatedCardSectionProps) {
  const { wrapperRef } = useCardAnimation({
    sectionIndex,
    isHeroSection: sectionIndex === 0,
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
