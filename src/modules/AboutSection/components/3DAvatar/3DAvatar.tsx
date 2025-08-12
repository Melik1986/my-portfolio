'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import styles from './Avatar.module.scss';

export function Avatar() {
  const refs = useAvatar();

  return (
    <div
      id="avaturn-container"
      ref={(el) => { refs.current.container = el; }}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <div
        className={styles["avatar-container"]}
        id="avaturn-loading"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: '#fff',
          background: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '5px',
        }}
      >
        Loading...
      </div>
    </div>
  );
};
