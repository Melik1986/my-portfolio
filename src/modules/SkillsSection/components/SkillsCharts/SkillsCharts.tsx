'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SkillsCharts.module.scss';
import { useSkillsCharts } from '../../hooks';

import { createElementTimeline } from '@/lib/gsap/hooks/useGsap';

interface SkillsChartsProps {
  // Props can be added here when needed
  [key: string]: unknown;
}

export function SkillsCharts({}: SkillsChartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeCharts } = useSkillsCharts();

  const [visible, setVisible] = useState(false);
  const chartsInitializedRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !chartsInitializedRef.current) {
          setVisible(true);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && !chartsInitializedRef.current) {
      initializeCharts();
      chartsInitializedRef.current = true;
      // Инициализация анимации для chart-wrapper
      if (containerRef.current) {
        const wrappers = containerRef.current.querySelectorAll('.chart-wrapper');
        wrappers.forEach((el) => createElementTimeline(el as HTMLElement));
      }
    }
  }, [visible, initializeCharts]);

  return (
    <div ref={containerRef} className={styles['skills__charts']}>
      <div className={styles['skills-charts__container']}>
        <div className={styles['chart-wrapper']} data-animation="slide-right">
          <div id="dev-skills-chart" className={styles['dev-skills-chart']} />
        </div>
        <div className={styles['chart-wrapper']} data-animation="slide-left">
          <div id="design-skills-chart" className={styles['design-skills-chart']} />
        </div>
      </div>
    </div>
  );
}
