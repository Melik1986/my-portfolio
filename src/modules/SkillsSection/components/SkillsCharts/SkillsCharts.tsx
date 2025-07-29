'use client';

import { useGsap } from '@/lib/hooks/useGsap';
import { useSkillsCharts } from '../../hooks';
import { useEffect } from 'react';
import styles from './SkillsCharts.module.scss';

export function SkillsCharts() {
  const { containerRef } = useGsap({});
  const { initializeCharts, playAnimation } = useSkillsCharts();

  useEffect(() => {
    initializeCharts();
    playAnimation();
  }, [initializeCharts, playAnimation]);

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
