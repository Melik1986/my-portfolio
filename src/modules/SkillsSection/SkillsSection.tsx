'use client';

import { SkillsContent, SkillsCharts } from './components/index';
import styles from './SkillsSection.module.scss';
import { useRef } from 'react';

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className={styles.skills} id="skills">
      <h2 className={`${styles.skills__title} visually-hidden`}>Skills</h2>
      <div className={`${styles['skills__content']} ${styles['skills__content-left']}`}>
        <SkillsContent />
      </div>
      <div className={`${styles['skills__content']} ${styles['skills__content-right']}`}>
        <SkillsCharts />
      </div>
    </section>
  );
}
