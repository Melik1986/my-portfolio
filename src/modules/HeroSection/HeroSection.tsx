'use client';

import { HeroLetters, HeroAvatar } from './components/index';
import { HeroContentLeft, HeroContentRight } from './components/index';
import styles from './HeroSection.module.scss';
import '@/app/styles/_visually-hidden.scss';
import { useI18n } from '@/i18n';

export function HeroSection() {
  const { t } = useI18n();
  return (
    <section className={styles.hero} id="hero" data-group-delay="1.5">
      <h2 className={`${styles.hero__title} visually-hidden`}>{t('hero.title')}</h2>
      <HeroLetters />
      <HeroAvatar />
      <div className={`${styles['hero__content']} ${styles['hero__content-left']}`}>
        <HeroContentLeft />
      </div>
      <div className={`${styles['hero__content']} ${styles['hero__content-right']}`}>
        <HeroContentRight />
      </div>
    </section>
  );
}
