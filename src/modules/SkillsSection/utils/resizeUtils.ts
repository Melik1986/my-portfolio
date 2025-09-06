import * as echarts from 'echarts/core';
import { SELECTORS, RESPONSIVE_BREAKPOINTS } from '../config/skillsCharts.config';
import { computeDevResponsiveConfig } from '../config/devChartOptions';

/**
 * Изменяет размеры графиков при изменении окна
 * Адаптирует графики под новый размер контейнера
 * @param devChart - график навыков разработки
 * @param designChart - график навыков дизайна
 */
export const resizeCharts = (
  devChart: echarts.ECharts | null,
  designChart: echarts.ECharts | null,
) => {
  if (!devChart || !designChart) return;

  /** Поиск DOM элементов графиков */
  const devChartElement = document.querySelector(SELECTORS.DEV_CHART) as HTMLElement | null;
  const designChartElement = document.querySelector(SELECTORS.DESIGN_CHART) as HTMLElement | null;

  if (!devChartElement || !designChartElement) return;

  /** Вычисление адаптивных параметров для столбчатой диаграммы */
  const containerWidth = devChartElement.offsetWidth;
  const devConfig = computeDevResponsiveConfig(containerWidth);

  /** Обновление настроек столбчатой диаграммы */
  devChart.setOption({
    xAxis: {
      axisLabel: { fontSize: devConfig.fontSize, rotate: devConfig.labelRotation },
    },
    series: [{ barWidth: devConfig.barWidth, barGap: devConfig.barGap }],
  });
  devChart.resize();

  /** Вычисление адаптивных параметров для круговой диаграммы */
  const designWidth = designChartElement.offsetWidth;
  const designHeight = designChartElement.offsetHeight;
  const minDimension = Math.min(designWidth, designHeight);
  const radius = Math.max(100, minDimension * 0.35);
  const legendFontSize =
    designWidth < RESPONSIVE_BREAKPOINTS.mobile
      ? 10
      : designWidth < RESPONSIVE_BREAKPOINTS.tablet
        ? 11
        : 12;

  /** Обновление настроек круговой диаграммы */
  designChart.setOption({
    legend: {
      textStyle: { fontSize: legendFontSize },
      show: (typeof window === 'undefined' ? designWidth : window.innerWidth) >= 390,
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
    },
    series: [{ radius: [0, radius] }],
  });
  designChart.resize();
};
