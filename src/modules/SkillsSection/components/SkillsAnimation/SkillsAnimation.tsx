'use client';

import React from 'react';
import styles from './SkillsAnimation.module.scss';

export function SkillsAnimation() {
  return (
    <div className={styles['skills__animation']} data-animation="slide-left">
      <div id="spiral1" className={styles['spiral']} />
      <div id="spiral2" className={styles['spiral']} />
    </div>
  );
}
