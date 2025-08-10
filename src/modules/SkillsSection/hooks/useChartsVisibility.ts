'use client';

import { useEffect, useRef, useState } from 'react';
import { useSkillsCharts } from '.';

export function useChartsVisibility() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initializeCharts, playAnimation, hideCharts } = useSkillsCharts();
  const [visible, setVisible] = useState(false);
  const chartsInitializedRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !chartsInitializedRef.current) {
          setVisible(true);
        } else if (!entry.isIntersecting && chartsInitializedRef.current) {
          setVisible(false);
          chartsInitializedRef.current = false; // Сбрасываем флаг
          // Запускаем реверс анимацию при скрытии
          setTimeout(() => {
            hideCharts();
          }, 100);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hideCharts]);

  useEffect(() => {
    if (visible && !chartsInitializedRef.current) {
      // Проверяем, что оба элемента реально существуют в DOM
      const devChart = document.getElementById('dev-skills-chart');
      const designChart = document.getElementById('design-skills-chart');
      if (devChart && designChart) {
        initializeCharts();
        chartsInitializedRef.current = true;
        
        // Запускаем анимацию после инициализации
        setTimeout(() => {
          playAnimation();
        }, 300);
      }
    }
  }, [visible, initializeCharts, playAnimation]);

  const chartWrapperProps = {
    'data-animation': 'slide-right',
    'data-duration': '0.8',
    'data-ease': 'power2.out',
    'data-delay': '0.3',
  };

  return {
    visible,
    containerRef,
    chartWrapperProps,
  };
}
