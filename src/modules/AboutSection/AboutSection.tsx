'use client';

import { AboutContent, AboutGallery } from './components/index';
import styles from './About.module.scss';

export function AboutSection() {


  return (
    <div className={styles.about} id="about">
      <h2 className={`${styles.about__title} visually-hidden`}>About</h2>
      <div className={`${styles['about__content']} ${styles['about__content-left']}`}>
        <AboutContent />
      </div>
      <div className={`${styles['about__content']} ${styles['about__content-right']}`}>
        <AboutGallery />
      </div>
    </div>
  );
}
