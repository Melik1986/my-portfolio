import { SKILLS_DATA, RESPONSIVE_BREAKPOINTS } from './skillsCharts.config';
import { COLOR_PALETTE } from './skillsCharts.config';
import { BASE_CHART_STYLES, TOOLTIP_STYLE, AXIS_STYLE } from './chartStyles';

import * as echarts from 'echarts';

/**
 * Создает адаптивную конфигурацию для столбчатой диаграммы
 * @param containerWidth - ширина контейнера диаграммы
 * @returns объект с адаптивными настройками
 */
const getResponsiveConfig = (containerWidth: number) => ({
  barWidth: Math.max(25, Math.min(45, containerWidth / 12)),
  fontSize:
    containerWidth < RESPONSIVE_BREAKPOINTS.mobile
      ? 10
      : containerWidth < RESPONSIVE_BREAKPOINTS.tablet
        ? 11
        : 12,
  labelRotation: containerWidth < RESPONSIVE_BREAKPOINTS.tablet ? 45 : 0,
});

/**
 * Создает конфигурацию всплывающих подсказок для столбчатой диаграммы
 * @returns объект конфигурации tooltip
 */
const getTooltipConfig = () => ({
  trigger: 'axis',
  ...TOOLTIP_STYLE,
  formatter: (params: { name: string; value: number }[]) => {
    const data = params[0];
    return `<strong>${data.name}</strong><br/>Level: ${data.value}%`;
  },
});

/**
 * Создает конфигурацию оси X для столбчатой диаграммы
 * @param config - объект с настройками шрифта и поворота
 * @returns объект конфигурации оси X
 */
const getXAxisConfig = (config: { fontSize: number; labelRotation: number }) => ({
  type: 'category',
  data: SKILLS_DATA.development.map((item) => item.skill),
  ...AXIS_STYLE,
  axisLabel: {
    ...AXIS_STYLE.axisLabel,
    rotate: config.labelRotation,
    fontSize: config.fontSize,
  },
});

/**
 * Создает конфигурацию оси Y для столбчатой диаграммы
 * @returns объект конфигурации оси Y
 */
const getYAxisConfig = () => ({
  type: 'value',
  max: 100,
  ...AXIS_STYLE,
  axisLabel: {
    ...AXIS_STYLE.axisLabel,
    formatter: '{value}%',
  },
  splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
});

/**
 * Создает конфигурацию серии данных для столбчатой диаграммы
 * @param barWidth - ширина столбцов
 * @returns массив конфигураций серий
 */
const getSeriesConfig = (barWidth: number) => [
  {
    name: 'Навыки разработки',
    type: 'bar',
    barWidth,
    barGap: 15,
    data: SKILLS_DATA.development.map(() => 0),
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: COLOR_PALETTE.primary },
        { offset: 1, color: COLOR_PALETTE.secondary },
      ]),
      borderRadius: [4, 4, 0, 0],
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDelay: (idx: number) => idx * 100,
  },
];

/**
 * Создает полную конфигурацию для столбчатой диаграммы навыков разработки
 * @param containerWidth - ширина контейнера диаграммы
 * @returns объект конфигурации ECharts для столбчатой диаграммы
 */
export const getDevChartOptions = (containerWidth: number) => {
  const config = getResponsiveConfig(containerWidth);

  return {
    ...BASE_CHART_STYLES,
    tooltip: getTooltipConfig(),
    xAxis: getXAxisConfig(config),
    yAxis: getYAxisConfig(),
    series: getSeriesConfig(config.barWidth),
  };
};
