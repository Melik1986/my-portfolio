'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import { useCardAnimation } from './hooks/useCardAnimation';
import { AnimatedCardSectionProps } from '@/modules/AnimatedCardSection/types/animated-card-section';
import styles from './Section.module.scss';


export function AnimatedCardSection({
  id,
  children,
  direction = 'vertical',
}: Omit<AnimatedCardSectionProps, 'sectionIndex' | 'contentTimelinesRef'>) {
  // Определяем индекс секции автоматически через context или DOM (упрощённо: через ref и effect)
  const [sectionIndex, setSectionIndex] = React.useState<number | null>(null);
  const localWrapperRef = useRef<HTMLLIElement>(null);

  // Получаем ref из хука анимации
  const { wrapperRef } = useCardAnimation({
    direction,
    sectionIndex,
  });

  useEffect(() => {
    if (localWrapperRef.current && localWrapperRef.current.parentElement) {
      const items = Array.from(localWrapperRef.current.parentElement.children);
      setSectionIndex(items.indexOf(localWrapperRef.current));
    }
  }, []);

  // Синхронизируем refs
  useEffect(() => {
    if (localWrapperRef.current && wrapperRef) {
      (wrapperRef as React.MutableRefObject<HTMLLIElement | null>).current = localWrapperRef.current;
    }
  }, [wrapperRef]);

  return (
    <li ref={localWrapperRef} className={styles.portfolio__item} id={id}>
      {children}
    </li>
  );
}
