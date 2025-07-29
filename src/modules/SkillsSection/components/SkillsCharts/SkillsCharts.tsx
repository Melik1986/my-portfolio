'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import styles from './SkillsCharts.module.scss';

export function SkillsCharts() {
  const { containerRef } = useGsap({});

  // Пример интеграции: запуск анимации при монтировании
  // Вы можете интегрировать с GSAP или другими хуками по необходимости

  return (
    <div ref={containerRef} className={styles['skills__charts']} data-animation="slide-right">
      <div className={styles['skills-charts__container']}>
        <div className={styles['chart-wrapper']} id="dev-skills-chart-wrapper">
          <div id="dev-skills-chart" />
        </div>
        <div className={styles['chart-wrapper']} id="design-skills-chart-wrapper">
          <div id="design-skills-chart" />
        </div>
      </div>
    </div>
  );
}
