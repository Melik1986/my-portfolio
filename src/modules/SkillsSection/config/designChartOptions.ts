import { SKILLS_DATA, RESPONSIVE_BREAKPOINTS, COLOR_PALETTE } from './skillsCharts.config';
import { getTooltipStyle, getBaseChartStyles } from './chartStyles';
import type { EChartsOption, CallbackDataParams } from 'echarts/types/dist/shared';
import { readCssVar } from '../../../lib/utils/css-vars';

/**
 * Создает конфигурацию для круговой диаграммы дизайн-навыков
 * @param designWidth - ширина контейнера диаграммы
 * @param designHeight - высота контейнера диаграммы
 * @returns объект конфигурации ECharts для круговой диаграммы
 */
// eslint-disable-next-line max-lines-per-function
export const getDesignChartOptions = (designWidth: number, designHeight: number): EChartsOption => {
  /** Вычисление адаптивного радиуса диаграммы */
  const minDimension = Math.min(designWidth, designHeight);
  const viewportWidth = typeof window === 'undefined' ? designWidth : window.innerWidth;
  const isSmallTablet = viewportWidth < 800;
  const isTablet = viewportWidth < RESPONSIVE_BREAKPOINTS.tablet;
  const radius = isSmallTablet
    ? Math.max(80, minDimension * 0.26)
    : isTablet
      ? Math.max(90, minDimension * 0.28)
      : Math.max(100, minDimension * 0.33);
  /** Адаптивный размер шрифта легенды в зависимости от ширины экрана */
  const legendFontSize = viewportWidth < RESPONSIVE_BREAKPOINTS.mobile ? 9 : isTablet ? 10 : 12;

  const legendTextColor = readCssVar('--charts-text-color', '#333333');

  return {
    ...getBaseChartStyles(),
    /** Конфигурация легенды диаграммы: включена только на десктопах (>= 1024, по viewport) */
    legend:
      viewportWidth >= RESPONSIVE_BREAKPOINTS.desktop
        ? {
            orient: 'horizontal',
            bottom: '0%',
            left: 'center',
            textStyle: { color: legendTextColor, fontSize: legendFontSize },
            data: SKILLS_DATA.design.map((item) => item.name),
          }
        : { show: false },
    /** Конфигурация серии данных для круговой диаграммы */
    series: [
      {
        name: 'Design Skills',
        type: 'pie',
        radius: [0, radius],
        center: ['50%', isTablet ? (isSmallTablet ? '40%' : '38%') : '35%'],
        roseType: 'area',
        itemStyle: { borderRadius: 8 },
        label: { show: false },
        labelLine: { show: false },
        data: SKILLS_DATA.design.map((item, index) => ({
          value: 0,
          name: item.name,
          itemStyle: {
            color: index % 2 === 0 ? COLOR_PALETTE.primary : COLOR_PALETTE.secondary,
          },
        })),
        color: ['#29abe2', '#f9f9f7', '#494a51', '#29abe2', '#d7cfcb', '#3668b1'],
        animationType: 'expansion',
        animationDuration: 1200,
        animationDelay: (idx: number) => idx * 150,
      },
    ],
    /** Конфигурация всплывающих подсказок */
    tooltip: {
      trigger: 'item',
      ...getTooltipStyle(),
      formatter: (params: CallbackDataParams) => {
        return `<strong>${params.name}</strong><br/>Level: ${params.value}%`;
      },
    },
  } as EChartsOption;
};
