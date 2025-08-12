'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import styles from './Avatar.module.scss';

export function Avatar() {
  const refs = useAvatar();

  return (
    <div
      id="avaturn-container"
      ref={(el) => {
        refs.current.container = el;
      }}
      className={styles['avatar-container']}
      data-animation="slide-right"
      data-delay="0.5"
      data-duration="0.8"
      data-ease="power2.out"
    >
      <div id="avaturn-loading" className={styles['avatar-loading']}>
        Loading...
      </div>
    </div>
  );
}
