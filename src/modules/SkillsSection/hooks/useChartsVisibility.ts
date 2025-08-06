'use client';

import { useEffect, useRef, useState } from 'react';
import { useSkillsCharts } from '.';

export function useChartsVisibility() {
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
      // Проверяем, что оба элемента реально существуют в DOM
      const devChart = document.getElementById('dev-skills-chart');
      const designChart = document.getElementById('design-skills-chart');
      if (devChart && designChart) {
        initializeCharts();
        chartsInitializedRef.current = true;
      }
    }
  }, [visible, initializeCharts]);

  const chartWrapperProps = {
    'data-animation': 'slide-right',
    'data-duration': '1.2',
    'data-ease': 'power2.out',
    'data-delay': '0.3',
  };

  return {
    visible,
    containerRef,
    chartWrapperProps,
  };
}