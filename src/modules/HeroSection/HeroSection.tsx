'use client';

import { HeroLetters, HeroAvatar } from './components/index';
import { HeroContentLeft, HeroContentRight } from './components/index';
import styles from './HeroSection.module.scss';
import '@/styles/_visually-hidden.scss';

export function HeroSection() {
  return (
    <div className={styles.hero} id="hero">
      <h2 className={`${styles.hero__title} visually-hidden`}>Hi, I&apos;m</h2>
      <HeroLetters />
      <HeroAvatar />
      <div className={`${styles['hero__content']} ${styles['hero__content-left']}`}>
        <HeroContentLeft />
      </div>
      <div className={`${styles['hero__content']} ${styles['hero__content-right']}`}>
        <HeroContentRight />
      </div>
    </div>
  );
}
