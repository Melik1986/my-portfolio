'use client';

import { useEffect, useRef, useCallback } from 'react';
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
// readCssVar removed: canvas background is handled by CSS container variables
import { resizeCharts } from '../utils/resizeUtils';

// Флаг для отслеживания регистрации ECharts компонентов
let echartsRegistered = false;

// centralized in utils

/**
 * Регистрирует ECharts компоненты только при первом использовании
 */
const registerEChartsComponents = () => {
  if (!echartsRegistered) {
    echarts.use([
      BarChart,
      PieChart,
      TitleComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      CanvasRenderer,
    ]);
    echartsRegistered = true;
  }
};

/**
 * Проверяет наличие и размеры DOM элементов
 */
const validateChartElements = () => {
  const devChartElement = document.querySelector(SELECTORS.DEV_CHART) as HTMLElement | null;
  const designChartElement = document.querySelector(SELECTORS.DESIGN_CHART) as HTMLElement | null;

  if (!devChartElement || !designChartElement) {
    // Chart elements not found
    return null;
  }

  if (devChartElement.offsetHeight === 0 || designChartElement.offsetHeight === 0) {
    // Chart containers have zero height
    return null;
  }

  return { devChartElement, designChartElement };
};

/**
 * Создает экземпляры графиков
 */
const createChartInstances = (
  devChartRef: { current: echarts.ECharts | null },
  designChartRef: { current: echarts.ECharts | null },
  devChartElement: HTMLElement,
  designChartElement: HTMLElement,
) => {
  // Регистрируем ECharts компоненты только при первом использовании
  registerEChartsComponents();

  // Проверяем, не инициализированы ли уже графики
  if (devChartRef.current) {
    devChartRef.current.dispose();
  }
  if (designChartRef.current) {
    designChartRef.current.dispose();
  }

  // Цвет фона теперь контролируется контейнером .chart-wrapper через CSS переменные.
  // Не задаём background на сам элемент/канвас — оставляем canvas прозрачным.
  devChartRef.current = echarts.init(devChartElement, null, {
    renderer: 'canvas',
    useDirtyRect: false,
    useCoarsePointer: false,
    ssr: false,
    width: 'auto',
    height: 'auto',
  });
  // container background must be controlled via CSS; keep canvas transparent

  designChartRef.current = echarts.init(designChartElement, null, {
    renderer: 'canvas',
    useDirtyRect: false,
    useCoarsePointer: false,
    ssr: false,
    width: 'auto',
    height: 'auto',
  });
  // container background must be controlled via CSS; keep canvas transparent

  // Отключаем wheel события для предотвращения passive listener warnings
  if (devChartRef.current) {
    const zr = devChartRef.current.getZr();
    zr.off('mousewheel');
    zr.off('wheel');
    // Отключаем обработчики событий на уровне DOM
    const dom = devChartRef.current.getDom();
    if (dom) {
      (dom as HTMLElement).style.touchAction = 'pan-y';
    }
  }

  if (designChartRef.current) {
    const zr = designChartRef.current.getZr();
    zr.off('mousewheel');
    zr.off('wheel');
    // Отключаем обработчики событий на уровне DOM
    const dom = designChartRef.current.getDom();
    if (dom) {
      (dom as HTMLElement).style.touchAction = 'pan-y';
    }
  }
};

/**
 * Настраивает опции графиков
 */
const configureChartOptions = (
  devChartRef: { current: echarts.ECharts | null },
  designChartRef: { current: echarts.ECharts | null },
  devChartElement: HTMLElement,
  designChartElement: HTMLElement,
) => {
  const containerWidth = devChartElement.offsetWidth;
  devChartRef.current?.setOption(getDevChartOptions(containerWidth), { notMerge: true });

  const designWidth = designChartElement.offsetWidth;
  const designHeight = designChartElement.offsetHeight;
  designChartRef.current?.setOption(getDesignChartOptions(designWidth, designHeight), {
    notMerge: true,
  });
};

/**
 * Хук для управления графиками навыков
 * Инициализирует и управляет ECharts графиками для отображения навыков
 * @returns объект с методами управления графиками
 */
// eslint-disable-next-line max-lines-per-function
export const useSkillsCharts = () => {
  const devChartRef = useRef<echarts.ECharts | null>(null);
  const designChartRef = useRef<echarts.ECharts | null>(null);
  const themeObserverRef = useRef<MutationObserver | null>(null);

  const setupCharts = useCallback(() => {
    const elements = validateChartElements();
    if (!elements) return;

    const { devChartElement, designChartElement } = elements;
    createChartInstances(devChartRef, designChartRef, devChartElement, designChartElement);
    configureChartOptions(devChartRef, designChartRef, devChartElement, designChartElement);
  }, [devChartRef, designChartRef]);

  const initializeCharts = useCallback(() => {
    setupCharts();
  }, [setupCharts]);

  /** Инициализация графиков и обработка изменения размера окна */
  useEffect(() => {
    // Убираем автоматическую инициализацию - она будет вызываться из useChartsVisibility
    // initializeCharts();

    let rafId: number | null = null;
    const onResize = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        resizeCharts(devChartRef.current, designChartRef.current);
        rafId = null;
      });
    };
    window.addEventListener('resize', onResize);

    // Observe theme changes to update background/text colors
    themeObserverRef.current = new MutationObserver(() => {
      const elements = validateChartElements();
      if (!elements) return;
      const { devChartElement, designChartElement } = elements;

      // Re-init (simplest) to apply new backgroundColor; ECharts lacks live update for init bg
      createChartInstances(devChartRef, designChartRef, devChartElement, designChartElement);
      configureChartOptions(devChartRef, designChartRef, devChartElement, designChartElement);
      // Background is controlled by CSS on .chart-wrapper; no runtime DOM background assignment here.
      // re-run animation after theme change
      playAnimation(devChartRef.current, designChartRef.current);
    });
    themeObserverRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const currentDevChart = devChartRef.current;
    const currentDesignChart = designChartRef.current;

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (currentDevChart) currentDevChart.dispose();
      if (currentDesignChart) currentDesignChart.dispose();
      if (themeObserverRef.current) {
        themeObserverRef.current.disconnect();
        themeObserverRef.current = null;
      }
    };
  }, []);

  return {
    initializeCharts,
    playAnimation: () => playAnimation(devChartRef.current, designChartRef.current),
    hideCharts: () => hideCharts(devChartRef.current, designChartRef.current),
    resetAnimation: () => resetAnimation(devChartRef, designChartRef),
    resizeCharts: () => resizeCharts(devChartRef.current, designChartRef.current),
    getChartElements: () => ({
      leftContainer: document.querySelector('[class*="skills-charts__container"]'),
      chartWrappers: document.querySelectorAll('[class*="chart-wrapper"]'),
    }),
  };
};
