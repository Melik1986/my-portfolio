'use client';

import React, { useRef, useEffect } from 'react';
import { useSpiralAnimation } from '../../hooks/useSpiralAnimation';
import { SpiralIconFactory } from '../../utils/spiralIcon';
import { TECH_ICONS, DEFAULT_SPIRAL_CONFIG } from '../../config/spiral.config';
import styles from './SkillsAnimation.module.scss';

/**
 * Компонент спиральной анимации технологических иконок
 * Отображает две спирали с вращающимися иконками технологий
 */
export function SkillsAnimation() {
  const spiralContainerRef = useRef<HTMLDivElement>(null);
  const spiral1Ref = useRef<HTMLDivElement>(null);
  const spiral2Ref = useRef<HTMLDivElement>(null);

  // Инициализация спиралей с иконками
  useEffect(() => {
    if (!spiral1Ref.current || !spiral2Ref.current) return;

    // Очищаем контейнеры
    spiral1Ref.current.innerHTML = '';
    spiral2Ref.current.innerHTML = '';

    // Заполняем спирали иконками
    for (let i = 0; i < DEFAULT_SPIRAL_CONFIG.numIcons; i++) {
      const iconData = TECH_ICONS[i % TECH_ICONS.length];
      const offset = i * DEFAULT_SPIRAL_CONFIG.elementSpacing;

      const icon1 = SpiralIconFactory.createIcon(iconData, offset);
      const icon2 = SpiralIconFactory.createIcon(iconData, offset);

      spiral1Ref.current.appendChild(icon1);
      spiral2Ref.current.appendChild(icon2);
    }
  }, []);

  // Запуск анимации для каждой спирали
  useSpiralAnimation(spiral1Ref);
  useSpiralAnimation(spiral2Ref);

  return (
    <div
      ref={spiralContainerRef}
      className={styles['skills__animation']}
      data-animation="slide-left"
      data-duration="1.0"
      data-ease="power2.out"
      data-delay="0.7"
    >
      <div ref={spiral1Ref} className={styles['spiral']} data-spiral="1" />
      <div ref={spiral2Ref} className={styles['spiral']} data-spiral="2" />
    </div>
  );
}
