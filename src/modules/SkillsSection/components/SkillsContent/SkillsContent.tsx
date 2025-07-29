'use client';

import { SkillsText, SkillsAnimation } from '../index';
import { useGsap } from '@/lib/hooks/useGsap';
import styles from './SkillsContent.module.scss';

export function SkillsContent() {
  const { containerRef } = useGsap({});

  return (
    <>
      <h3
        ref={containerRef}
        className={styles['skills__heading']}
        data-animation="slide-left"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.2"
      >
        Skills &amp;&nbsp;Expertise
      </h3>
      <SkillsText />
      <SkillsAnimation />
    </>
  );
}
