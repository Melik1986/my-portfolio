'use client';

import { lazy, Suspense } from 'react';
import styles from './AboutContent.module.scss';
import { useI18n } from '@/i18n';

// Ленивый импорт тяжёлой анимации
const AboutAnimationLazy = lazy(() =>
  import('../AboutAnimation/AboutAnimation').then((mod) => ({
    default: mod.AboutAnimation,
  })),
);

/**
 * Содержимое текста "Обо мне"
 * Содержит основной текст описания разработчика
 */
function AboutTextDesktop() {
  const { t } = useI18n();
  return (
    <span className={styles['about__text-desktop']}>
      {t('section.about.text.desktop')}
    </span>
  );
}

function AboutTextMobile() {
  const { t } = useI18n();
  return (
    <span className={styles['about__text-mobile']}>
      {t('section.about.text.mobile')}
    </span>
  );
}

/**
 * Основной контент секции "Обо мне"
 * Композирует заголовок, текст и Aurora анимацию
 */
export function AboutContent() {
  const { t } = useI18n();
  return (
    <>
      <h3
        className={styles['about__heading']}
        data-animation="slide-left"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0"
      >
        {t('section.about.heading')}
      </h3>
      <p
        className={styles['about__text']}
        data-animation="text-reveal"
        data-duration="1.2"
        data-ease="power2.out"
        data-delay="0.5"
      >
        <AboutTextDesktop />
        <AboutTextMobile />
      </p>
      <div
        className={styles['about__animation']}
        data-animation="fade-up"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.6"
      >
        <Suspense fallback={<div className={styles['about__animation-placeholder']} />}>
          <AboutAnimationLazy />
        </Suspense>
      </div>
    </>
  );
}
