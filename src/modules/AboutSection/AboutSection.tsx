'use client';

import { AboutContent } from './components/index';
import { useRef } from 'react';
import styles from './About.module.scss';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className={styles.about}
      id="about"
      data-section-index="1"
      data-group-delay="3.0"
    >
      <h2 className={`${styles.about__title} visually-hidden`}>About</h2>
      <div className={`${styles['about__content']} ${styles['about__content-left']}`}>
        <AboutContent />
      </div>
      <div className={`${styles['about__content']} ${styles['about__content-right']}`}></div>
    </section>
  );
}
