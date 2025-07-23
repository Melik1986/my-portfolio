'use client';

import { AboutContentProps } from '@/types/about.types';
import { AboutAnimation } from '../AboutAnimation/AboutAnimation';
import styles from './AboutContent.module.scss';

const headingAnimation = {
  'data-animation': 'slide-left',
  'data-duration': '0.8',
  'data-ease': 'power2.out',
  'data-delay': '0',
};

const textAnimation = {
  'data-animation': 'text-reveal',
};

export const AboutContent: React.FC<AboutContentProps> = (props) => {
  return (
    <div className={styles['about__content-left']}>
      <h2 className={styles['about__heading']} {...headingAnimation}>
        About Me
      </h2>
      <p className={styles['about__text']} {...textAnimation}>
        Hi, I&rsquo;m Melik&nbsp;&mdash; a&nbsp;results-driven frontend developer and UI/UX designer
        with a&nbsp;strong commitment to&nbsp;creating modern, high-performance websites. After
        moving to&nbsp;Germany, I&nbsp;transformed my&nbsp;career, leveraging my&nbsp;technical
        background to&nbsp;master web development. Today, I&nbsp;specialize in&nbsp;building
        responsive, user-centric digital experiences using HTML, CSS, JavaScript, and React.
        My&nbsp;value goes beyond just writing code &mdash; I&nbsp;combine technical skills with
        a&nbsp;design-driven mindset to&nbsp;deliver clean, intuitive interfaces that not only look
        great but also drive engagement. I&rsquo;m passionate about solving real-world problems,
        optimizing user experiences, and ensuring every project is&nbsp;efficient and scalable.
        Successfully transitioned from a&nbsp;technical industry to&nbsp;web development,
        continuously upgrading my&nbsp;skills through professional webinars and courses.
        As&nbsp;a&nbsp;dedicated professional and a&nbsp;proud father, I&nbsp;know the value
        of&nbsp;responsibility, persistence, and inspiring those around&nbsp;me.
      </p>
      <AboutAnimation />
    </div>
  );
};
