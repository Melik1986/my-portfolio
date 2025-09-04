'use client';

import { HeroLetters, HeroAvatar } from './components/index';
import { HeroContentLeft, HeroContentRight } from './components/index';
import styles from './HeroSection.module.scss';
import '@/app/styles/_visually-hidden.scss';
import { useI18n } from '@/i18n';
import { useRef } from 'react';

export function HeroSection() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} className={styles.hero} id="hero" data-group-delay="1.5">
      <h2 className={`${styles.hero__title} visually-hidden`}>{t('section.hero.title')}</h2>
      <HeroAvatar />
      <div className={styles['hero__content']}>
        <HeroLetters />
        <HeroContentLeft />
        <HeroContentRight />
      </div>
    </section>
  );
}
