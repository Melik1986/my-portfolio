'use client';

import React, { useState } from 'react';
import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section';
import styles from './Section.module.scss';

export function AnimatedCardSection({
  id,
  children,
  direction: initialDirection = 'vertical',
  sectionIndex,
}: Omit<AnimatedCardSectionProps, 'contentTimelinesRef'>) {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(initialDirection);
  
  console.log(`🎨 AnimatedCardSection rendering:`, {
    id,
    sectionIndex,
    direction,
    initialDirection,
    hasChildren: !!children,
  });

  const { wrapperRef } = useCardAnimation({
    direction,
    sectionIndex,
    onDirectionChange: setDirection,
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
