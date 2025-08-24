'use client';

import { lazy, Suspense } from 'react';
import styles from './AboutContent.module.scss';

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
  return (
    <span className={styles['about__text-desktop']}>
      Hi, I&rsquo;m Melik&nbsp;&mdash; a&nbsp;results-driven frontend developer and UI/UX designer
      with a&nbsp;strong focus on&nbsp;creating modern, high-performance websites. After moving
      to&nbsp;Germany, I&nbsp;made a&nbsp;bold career transition, leveraging my&nbsp;technical
      background to&nbsp;fully master web development. Today, I&nbsp;specialize in&nbsp;building
      responsive, user-centric digital experiences using HTML, CSS, JavaScript, and React.
      My&nbsp;value goes beyond coding&nbsp;&mdash; I&nbsp;combine technical expertise with
      a&nbsp;design-driven mindset, delivering clean, intuitive interfaces that don&rsquo;t just
      look good but also engage users and achieve business goals. Passionate about solving real
      problems and optimizing user experiences, I&nbsp;ensure every project is&nbsp;efficient,
      scalable, and meaningful. As&nbsp;a&nbsp;dedicated professional and a&nbsp;proud father,
      I&nbsp;bring responsibility, persistence, and inspiration into everything I&nbsp;create.
    </span>
  );
}

function AboutTextMobile() {
  return (
    <span className={styles['about__text-mobile']}>
      Hi, I&rsquo;m Melik&nbsp;&mdash; a&nbsp;frontend developer and UI/UX designer focused
      on&nbsp;building modern, user-centric websites. I&nbsp;combine clean code with thoughtful
      design to&nbsp;create responsive, engaging experiences. Passionate about solving real problems
      and delivering value, I&nbsp;bring both technical skills and a&nbsp;creative mindset
      to&nbsp;every project.
    </span>
  );
}

/**
 * Основной контент секции "Обо мне"
 * Композирует заголовок, текст и Aurora анимацию
 */
export function AboutContent() {
  return (
    <>
      <h3
        className={styles['about__heading']}
        data-animation="slide-left"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0"
      >
        About Me
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
