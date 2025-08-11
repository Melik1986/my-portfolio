'use client';

import { AboutAnimation } from '../index';
import styles from './AboutContent.module.scss';

function AboutText() {
  return (
    <p
      className={styles['about__text']}
      data-animation="text-reveal"
      data-duration="1.2"
      data-ease="power2.out"
      data-delay="0.5"
    >
      <AboutTextContent />
    </p>
  );
}

/**
 * Содержимое текста "Обо мне"
 * Содержит основной текст описания разработчика
 */
function AboutTextContent() {
  return (
    <>
      Hi, I&rsquo;m Melik&nbsp;&mdash; a&nbsp;results-driven frontend developer and UI/UX designer
      with a&nbsp;strong commitment to&nbsp;creating modern, high-performance websites. After moving
      to&nbsp;Germany, I&nbsp;transformed my&nbsp;career, leveraging my&nbsp;technical background
      to&nbsp;master web development. Today, I&nbsp;specialize in&nbsp;building responsive,
      user-centric digital experiences using HTML, CSS, JavaScript, and React. My&nbsp;value goes
      beyond just writing code &mdash; I&nbsp;combine technical skills with a&nbsp;design-driven
      mindset to&nbsp;deliver clean, intuitive interfaces that not only look great but also drive
      engagement. I&rsquo;m passionate about solving real-world problems, optimizing user
      experiences, and ensuring every project is&nbsp;efficient and scalable. Successfully
      transitioned from a&nbsp;technical industry to&nbsp;web development, continuously upgrading
      my&nbsp;skills through professional webinars and courses. As&nbsp;a&nbsp;dedicated
      professional and a&nbsp;proud father, I&nbsp;know the value of&nbsp;responsibility,
      persistence, and inspiring those around&nbsp;me.
    </>
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
      <AboutText />
      <AboutAnimation
        data-animation="fade-up"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.6"
      />
    </>
  );
}
