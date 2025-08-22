import { SKILLS_DATA, RESPONSIVE_BREAKPOINTS, COLOR_PALETTE } from './skillsCharts.config';
import { getTooltipStyle, getBaseChartStyles } from './chartStyles';
import type { EChartsOption, CallbackDataParams } from 'echarts/types/dist/shared';

function readCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/**
 * Создает конфигурацию для круговой диаграммы дизайн-навыков
 * @param designWidth - ширина контейнера диаграммы
 * @param designHeight - высота контейнера диаграммы
 * @returns объект конфигурации ECharts для круговой диаграммы
 */
export const getDesignChartOptions = (designWidth: number, designHeight: number): EChartsOption => {
  /** Вычисление адаптивного радиуса диаграммы */
  const minDimension = Math.min(designWidth, designHeight);
  const radius =
    designWidth < RESPONSIVE_BREAKPOINTS.mobile
      ? Math.max(80, minDimension * 0.28)
      : designWidth < RESPONSIVE_BREAKPOINTS.tablet
        ? Math.max(90, minDimension * 0.3)
        : Math.max(100, minDimension * 0.35);
  /** Адаптивный размер шрифта легенды в зависимости от ширины экрана */
  const legendFontSize =
    designWidth < RESPONSIVE_BREAKPOINTS.mobile
      ? 9
      : designWidth < RESPONSIVE_BREAKPOINTS.tablet
        ? 10
        : 12;

  const legendTextColor = readCssVar('--charts-text-color', '#333333');

  return {
    ...getBaseChartStyles(),
    /** Конфигурация легенды диаграммы */
    legend: {
      orient: 'horizontal',
      bottom: designWidth < RESPONSIVE_BREAKPOINTS.tablet ? '2%' : '0%',
      left: 'center',
      textStyle: { color: legendTextColor, fontSize: legendFontSize },
      data: SKILLS_DATA.design.map((item) => item.name),
    },
    /** Конфигурация серии данных для круговой диаграммы */
    series: [
      {
        name: 'Design Skills',
        type: 'pie',
        radius: [0, radius],
        center: ['50%', designWidth < RESPONSIVE_BREAKPOINTS.tablet ? '38%' : '35%'],
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
