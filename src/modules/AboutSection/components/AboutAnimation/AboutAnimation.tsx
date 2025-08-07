'use client';

import React, { useRef, useEffect } from 'react';
import { useAuroraAnimation } from '@/modules/AboutSection/hooks/useAuroraAnimation';
import { useAnimationLoop } from '@/modules/AboutSection/hooks/useAnimationLoop';
import { useEventHandlers } from '@/modules/AboutSection/hooks/useEventHandlers';
import styles from './AboutAnimation.module.scss';

/**
 * Компонент Aurora анимации
 * Создает контейнер для Three.js Aurora эффекта
 */
export function AboutAnimation() {
  const containerRef = React.useRef<HTMLDivElement>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 1. Инициализация three.js
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { sceneRef, cameraRef, rendererRef } = useAuroraAnimation(containerRef);

  React.useEffect(() => {
    if (sceneRef.current && cameraRef.current && rendererRef.current) {
      setIsInitialized(true);
    }
  }, [sceneRef, cameraRef, rendererRef]);

  // 2. Управление циклом анимации
  const { startAnimation, stopAnimation } = useAnimationLoop({
    sceneRef,
    cameraRef,
    rendererRef,
    mouseRef,
  });

  // 3. Управление обработчиками событий
  useEventHandlers({
    containerRef,
    cameraRef,
    rendererRef,
    mouseRef,
    startAnimation,
    stopAnimation,
    isInitialized,
  });

  // Запуск и остановка анимации при монтировании/размонтировании
  useEffect(() => {
    if (isInitialized) {
      startAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isInitialized, startAnimation, stopAnimation]);

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
