'use client';

import styles from './SkillsCharts.module.scss';
import { useChartsVisibility } from '../../hooks/useChartsVisibility';

interface SkillsChartsProps {
  // Props can be added here when needed
  [key: string]: unknown;
}

export function SkillsCharts({}: SkillsChartsProps) {
  const { containerRef, chartWrapperProps } = useChartsVisibility();

  return (
    <div ref={containerRef} className={styles['skills__charts']}>
      <div className={styles['skills-charts__container']}>
        <div className={styles['chart-wrapper']} {...chartWrapperProps}>
          <div id="dev-skills-chart" className={styles['dev-skills-chart']} />
        </div>
        <div className={styles['chart-wrapper']} {...chartWrapperProps} data-animation="slide-left">
          <div id="design-skills-chart" className={styles['design-skills-chart']} />
        </div>
      </div>
    </div>
  );
}
