'use client';

import { useGsap } from '@/lib/gsap/hooks/useGsap';
import styles from './SkillsAnimation.module.scss';

export function SkillsAnimation() {
  const { containerRef } = useGsap({});

  return (
    <div ref={containerRef} className={styles['skills__animation']} data-animation="slide-left">
      <div id="spiral1" className={styles['spiral']} />
      <div id="spiral2" className={styles['spiral']} />
    </div>
  );
}
