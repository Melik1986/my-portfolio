'use client';

import { useRef } from 'react';
import { useGsapAnimation } from '@/modules/HeroSection/hooks/useGsapAnimation';
import { HeroLettersProps } from '@/types/hero.types';
import styles from './HeroLetters.module.scss';

const containerData = {
  animation: 'slide-down',
  duration: '0.8',
  stagger: '0.1',
  ease: 'power2.out',
  groupDelay: '0.66',
};
const containerAnimation = {
  'data-animation': containerData.animation,
  'data-duration': containerData.duration,
  'data-stagger': containerData.stagger,
  'data-ease': containerData.ease,
  'data-delay': containerData.groupDelay,
};

export const HeroLetters: React.FC<HeroLettersProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapAnimation(containerRef as React.RefObject<Element>, containerData);

  return (
    <div className={styles['hero__container-letters']} ref={containerRef} {...containerAnimation}>
      <span className={styles['hero__text']} data-title="P">P</span>
      <span className={styles['hero__text']} data-title="O">O</span>
      <span className={styles['hero__text']} data-title="R">R</span>
      <span className={styles['hero__text']} data-title="T">T</span>
      <span className={styles['hero__text']} data-title="F">F</span>
      <span className={styles['hero__text']} data-title="O">O</span>
      <span className={styles['hero__text']} data-title="L">L</span>
      <span className={styles['hero__text']} data-title="I">I</span>
      <span className={styles['hero__text']} data-title="O">O</span>
    </div>
  );
};
