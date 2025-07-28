'use client';

import { AboutContent, AboutGallery } from './components/index';
import styles from './About.module.scss';

/**
 * Секция "Обо мне" с анимацией
 * Содержит информацию о разработчике с Aurora анимацией
 */
export function AboutSection() {

  return (
    <div className={styles.about} id="about">
      <h2 className={`${styles.about__title} visually-hidden`}>About</h2>
      <AboutContent />
      <AboutGallery />
    </div>
  );
}
