'use client';

import { useEffect, useRef } from 'react';
import styles from './SkillsCharts.module.scss';
import { useSkillsCharts } from '../../hooks';

interface SkillsChartsProps {
  // Props can be added here when needed
  [key: string]: unknown;
}

export function SkillsCharts({}: SkillsChartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeCharts } = useSkillsCharts();
  const chartsInitializedRef = useRef(false);


  useEffect(() => {
    // Инициализируем диаграммы после монтирования
    if (!chartsInitializedRef.current) {
      initializeCharts();
      chartsInitializedRef.current = true;
    }
  }, [initializeCharts]);

  return (
    <div ref={containerRef} className={styles['skills__charts']} data-animation="slide-right">
      <div className={styles['skills-charts__container']}>
        <div className={styles['chart-wrapper']}>
          <div id="dev-skills-chart" className={styles['dev-skills-chart']} />
        </div>
        <div className={styles['chart-wrapper']}>
          <div id="design-skills-chart" className={styles['design-skills-chart']} />
        </div>
      </div>
    </div>
  );
}
