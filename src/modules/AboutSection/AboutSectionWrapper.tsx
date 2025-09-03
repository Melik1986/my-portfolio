'use client';

import React from 'react';
import { AboutContent, Avatar } from './components/index';
import styles from './About.module.scss';
import { useI18n } from '@/i18n';

interface AboutSectionWrapperProps {
  isMobile?: boolean;
  part?: 'content' | 'avatar' | 'full';
}

// Рендер полной версии секции
function FullSection({ title }: { title: string }) {
  return (
    <section className={styles.about} id="about" data-section-index="1" data-group-delay="3.5">
      <h2 className={`${styles.about__title} visually-hidden`}>{title}</h2>
      <div className={`${styles['about__content']} ${styles['about__content-left']}`}>
        <AboutContent />
      </div>
      <div className={`${styles['about__content']} ${styles['about__content-right']}`}>
        <Avatar />
      </div>
    </section>
  );
}

// Рендер только контента для мобильной версии
function MobileContentSection({ title }: { title: string }) {
  return (
    <section
      className={styles.about}
      id="about-content"
      data-section-index="1.1"
      data-group-delay="0"
    >
      <h2 className={`${styles.about__title} visually-hidden`}>{title}</h2>
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

// Рендер только аватара для мобильной версии
function MobileAvatarSection() {
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

export function AboutSectionWrapper({ isMobile = false, part = 'full' }: AboutSectionWrapperProps) {
  const { t } = useI18n();
  const title = t('section.about.title');

  if (!isMobile || part === 'full') {
    return <FullSection title={title} />;
  }

  if (part === 'content') {
    return <MobileContentSection title={title} />;
  }

  if (part === 'avatar') {
    return <MobileAvatarSection />;
  }

  return null;
}
