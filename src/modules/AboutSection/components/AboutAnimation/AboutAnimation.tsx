'use client';

import React from 'react';
import { useAuroraAnimation } from '@/modules/AboutSection/hooks/useAuroraAnimation';
import styles from './AboutAnimation.module.scss';

/**
 * Компонент Aurora анимации
 * Создает контейнер для Three.js Aurora эффекта
 */
export function AboutAnimation() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  useAuroraAnimation(containerRef);

  return (
    <div
      ref={containerRef}
      className={styles.about__animation}
      id="aurora-container"
      data-animation="fade-up"
      data-duration="0.8"
      data-ease="power2.out"
    >
      {/* Canvas будет добавлен сюда с помощью JavaScript */}
    </div>
  );
}
