'use client';

import React from 'react';
import { useAvatarDebug } from '@/modules/AboutSection/hooks/useAvatarDebug';
import styles from './simple.module.scss';

export default function Test3DSimplePage() {
  const { containerRef, isLoading, error } = useAvatarDebug();

  return (
    <div className={styles.page}>
      <h1>Simple 3D Avatar Test</h1>
      
      <div className={styles.info}>
        <p>Status: {isLoading ? '⏳ Loading...' : error ? `❌ Error: ${error}` : '✅ Loaded'}</p>
      </div>

      <div className={styles.container}>
        <div ref={containerRef} className={styles.avatarContainer} />
      </div>

      <div className={styles.instructions}>
        <h2>Debug Info:</h2>
        <ul>
          <li>Open Developer Console (F12) to see logs</li>
          <li>Look for [Avatar Debug] messages</li>
          <li>Check Network tab for avatar.glb loading</li>
          <li>Mouse drag to rotate if loaded</li>
        </ul>
      </div>
    </div>
  );
}