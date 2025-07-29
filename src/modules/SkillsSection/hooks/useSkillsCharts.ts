'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { SELECTORS } from '../config/skillsCharts.config';
import { getDevChartOptions } from '../config/devChartOptions';
import { getDesignChartOptions } from '../config/designChartOptions';
import { playAnimation, hideCharts, resetAnimation } from '../utils/animationUtils';
import { resizeCharts } from '../utils/resizeUtils';

/**
 * Хук для управления графиками навыков
 * Инициализирует и управляет ECharts графиками для отображения навыков
 * @returns объект с методами управления графиками
 */
export const useSkillsCharts = () => {
  const devChartRef = useRef<echarts.ECharts | null>(null);
  const designChartRef = useRef<echarts.ECharts | null>(null);

  /**
   * Инициализирует графики ECharts
   * Регистрирует компоненты и создает экземпляры графиков
   */
  const initializeCharts = () => {
    // Задержка для полного рендера DOM
    setTimeout(() => {
      echarts.use([
        BarChart,
        PieChart,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        CanvasRenderer,
      ]);

      const devChartElement = document.querySelector(SELECTORS.DEV_CHART) as HTMLElement | null;
      const designChartElement = document.querySelector(SELECTORS.DESIGN_CHART) as HTMLElement | null;

      if (!devChartElement || !designChartElement) {
        console.warn('Chart elements not found');
        return;
      }

      // Проверяем размеры контейнеров
      if (devChartElement.offsetHeight === 0 || designChartElement.offsetHeight === 0) {
        console.warn('Chart containers have zero height');
        return;
      }

      devChartRef.current = echarts.init(devChartElement);
      designChartRef.current = echarts.init(designChartElement);

      const containerWidth = devChartElement.offsetWidth;
      devChartRef.current.setOption(getDevChartOptions(containerWidth));

      const designWidth = designChartElement.offsetWidth;
      const designHeight = designChartElement.offsetHeight;
      designChartRef.current.setOption(getDesignChartOptions(designWidth, designHeight));
    }, 100); // Задержка 100ms
  };

  /** Инициализация графиков и обработка изменения размера окна */
  useEffect(() => {
    initializeCharts();

    const handleResize = () => resizeCharts(devChartRef.current, designChartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (devChartRef.current) devChartRef.current.dispose();
      if (designChartRef.current) designChartRef.current.dispose();
    };
  }, []);

  return {
    initializeCharts,
    playAnimation: () => playAnimation(devChartRef.current, designChartRef.current),
    hideCharts: () => hideCharts(devChartRef.current, designChartRef.current),
    resetAnimation: () => resetAnimation(devChartRef, designChartRef),
    resizeCharts: () => resizeCharts(devChartRef.current, designChartRef.current),
  };
};
