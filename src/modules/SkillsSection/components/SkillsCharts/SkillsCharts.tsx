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
        <div
          className={styles['chart-wrapper']}
          {...chartWrapperProps}
          data-animation="slide-left"
          data-duration="0.8"
          data-ease="power2.out"
          data-delay="0.3"
        >
          <div id="dev-skills-chart" className={styles['dev-skills-chart']} />
        </div>
        <div
          className={styles['chart-wrapper']}
          {...chartWrapperProps}
          data-animation="slide-right"
          data-duration="0.8"
          data-ease="power2.out"
          data-delay="0.3"
        >
          <div id="design-skills-chart" className={styles['design-skills-chart']} />
        </div>
      </div>
    </div>
  );
}
