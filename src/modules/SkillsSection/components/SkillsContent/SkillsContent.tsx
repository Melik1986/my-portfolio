'use client';

import { SkillsText, SkillsAnimation } from '../index';
import styles from './SkillsContent.module.scss';

export function SkillsContent() {
  return (
    <>
      <h3
        className={styles['skills__heading']}
        data-animation="slide-left"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0"
      >
        Skills &amp;&nbsp;Expertise
      </h3>
      <SkillsText />
      <SkillsAnimation />
    </>
  );
}
