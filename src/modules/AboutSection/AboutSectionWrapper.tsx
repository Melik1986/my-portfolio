'use client';

import React from 'react';
import { AboutContent, Avatar } from './components/index';
import styles from './About.module.scss';
import { useI18n } from '@/i18n';

interface AboutSectionWrapperProps {
  isMobile?: boolean;
  part?: 'content' | 'avatar' | 'full';
}

export function AboutSectionWrapper({ isMobile = false, part = 'full' }: AboutSectionWrapperProps) {
  const { t } = useI18n();

  // Для десктопа или полной версии
  if (!isMobile || part === 'full') {
    return (
      <section className={styles.about} id="about" data-section-index="1" data-group-delay="3.5">
        <h2 className={`${styles.about__title} visually-hidden`}>{t('section.about.title')}</h2>
        <div className={`${styles['about__content']} ${styles['about__content-left']}`}>
          <AboutContent />
        </div>
        <div className={`${styles['about__content']} ${styles['about__content-right']}`}>
          <Avatar />
        </div>
      </section>
    );
  }

  // Для мобильной версии - только контент
  if (part === 'content') {
    return (
      <section
        className={styles.about}
        id="about-content"
        data-section-index="1.1"
        data-group-delay="0"
      >
        <h2 className={`${styles.about__title} visually-hidden`}>{t('section.about.title')}</h2>
        <div
          className={`${styles['about__content']} ${styles['about__content-left']}`}
          style={{ width: '100%' }}
          data-animation="fade-up"
          data-delay="0.2"
        >
          <AboutContent />
        </div>
      </section>
    );
  }

  // Для мобильной версии - только аватар
  if (part === 'avatar') {
    return (
      <section
        className={styles.about}
        id="about-avatar"
        data-section-index="1.2"
        data-group-delay="0"
      >
        <div
          className={`${styles['about__content']} ${styles['about__content-right']}`}
          style={{ width: '100%', height: '100%' }}
          data-animation="fade-up"
          data-delay="0.2"
        >
          <Avatar />
        </div>
      </section>
    );
  }

  return null;
}
