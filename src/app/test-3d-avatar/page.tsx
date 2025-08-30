'use client';

import React from 'react';
import { Avatar } from '@/modules/AboutSection/components/3DAvatar/3DAvatar';
import styles from './test-avatar.module.scss';

export default function Test3DAvatarPage() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Слушаем событие загрузки модели
    const handleModelLoaded = () => {
      setIsLoaded(true);
      console.log('✅ 3D Model loaded successfully!');
    };

    const handleError = (e: ErrorEvent) => {
      setError(e.message);
      console.error('❌ Error loading 3D model:', e);
    };

    window.addEventListener('modelLoaded', handleModelLoaded);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('modelLoaded', handleModelLoaded);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={styles.testPage}>
      <h1>3D Avatar Test Page</h1>
      
      <div className={styles.info}>
        <p>Status: {isLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
        {error && <p className={styles.error}>Error: {error}</p>}
      </div>

      <div className={styles.avatarWrapper}>
        <Avatar />
      </div>

      <div className={styles.debug}>
        <h3>Debug Info:</h3>
        <ul>
          <li>Model Path: /model/avatar.glb</li>
          <li>WebGL Support: {typeof WebGLRenderingContext !== 'undefined' ? '✅' : '❌'}</li>
          <li>Container Found: <span id="container-status">checking...</span></li>
          <li>Canvas Created: <span id="canvas-status">checking...</span></li>
        </ul>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        setTimeout(() => {
          const container = document.getElementById('avaturn-container');
          document.getElementById('container-status').textContent = container ? '✅' : '❌';
          
          const canvas = container?.querySelector('canvas');
          document.getElementById('canvas-status').textContent = canvas ? '✅' : '❌';
        }, 2000);
      `}} />
    </div>
  );
}