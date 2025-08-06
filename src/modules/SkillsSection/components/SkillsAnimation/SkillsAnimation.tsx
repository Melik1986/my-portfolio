'use client';

import React from 'react';
import styles from './SkillsAnimation.module.scss';

export function SkillsAnimation() {
  return (
    <div
      className={styles['skills__animation']}
      data-animation="slide-left"
      data-duration="1.0"
      data-ease="power2.out"
      data-delay="0.8"
    >
      <div id="spiral1" className={styles['spiral']} />
      <div id="spiral2" className={styles['spiral']} />
    </div>
  );
}
