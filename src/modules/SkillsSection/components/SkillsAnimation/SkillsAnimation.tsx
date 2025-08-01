'use client';

import React from 'react';
import styles from './SkillsAnimation.module.scss';

export function SkillsAnimation() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (containerRef.current) {
      import('@/lib/gsap/hooks/useGsap').then(({ createElementTimeline }) => {
        createElementTimeline(containerRef.current!);
      });
    }
  }, []);

  return (
    <div ref={containerRef} className={styles['skills__animation']} data-animation="slide-left">
      <div id="spiral1" className={styles['spiral']} />
      <div id="spiral2" className={styles['spiral']} />
    </div>
  );
}
