'use client';

import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import type { AvatarRefs } from '../../types/about.types';
import styles from './Avatar.module.scss';

function useAvatarModelLoading(refs: React.MutableRefObject<AvatarRefs>) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleModelLoaded = () => {
      setIsLoading(false);
    };

    const container = refs.current.container;
    if (container) {
      container.addEventListener('modelLoaded', handleModelLoaded);
    }

    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      if (container) {
        container.removeEventListener('modelLoaded', handleModelLoaded);
      }
      clearTimeout(fallbackTimer);
    };
  }, [refs]);

  return isLoading;
}

export function Avatar() {
  const refs = useAvatar();
  const isLoading = useAvatarModelLoading(refs);

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
      {isLoading && (
        <div id="avaturn-loading" className={styles['avatar-loading']}>
          Loading...
        </div>
      )}
    </div>
  );
}
