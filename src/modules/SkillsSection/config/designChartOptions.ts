import { SKILLS_DATA, RESPONSIVE_BREAKPOINTS, COLOR_PALETTE } from './skillsCharts.config';
import { TOOLTIP_STYLE } from './chartStyles';
import { CallbackDataParams } from 'echarts/types/dist/shared';

/**
 * Создает конфигурацию для круговой диаграммы дизайн-навыков
 * @param designWidth - ширина контейнера диаграммы
 * @param designHeight - высота контейнера диаграммы
 * @returns объект конфигурации ECharts для круговой диаграммы
 */
export const getDesignChartOptions = (designWidth: number, designHeight: number) => {
  /** Вычисление адаптивного радиуса диаграммы */
  const minDimension = Math.min(designWidth, designHeight);
  const radius = Math.max(100, minDimension * 0.35);
  /** Адаптивный размер шрифта легенды в зависимости от ширины экрана */
  const legendFontSize =
    designWidth < RESPONSIVE_BREAKPOINTS.mobile
      ? 10
      : designWidth < RESPONSIVE_BREAKPOINTS.tablet
        ? 11
        : 12;

  return {
    /** Конфигурация легенды диаграммы */
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      left: 'center',
      textStyle: { color: '#FFFFFF', fontSize: legendFontSize },
      data: SKILLS_DATA.design.map((item) => item.name),
    },
    /** Конфигурация серии данных для круговой диаграммы */
    series: [
      {
        name: 'Design Skills',
        type: 'pie',
        radius: [0, radius],
        center: ['50%', '35%'],
        roseType: 'area',
        itemStyle: { borderRadius: 8 },
        label: { show: false },
        labelLine: { show: false },
        data: SKILLS_DATA.design.map((item, index) => ({ 
          value: 0, 
          name: item.name,
          itemStyle: {
            color: index % 2 === 0 ? COLOR_PALETTE.primary : COLOR_PALETTE.secondary
          }
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
      ...TOOLTIP_STYLE,
      formatter: (params: CallbackDataParams) => {
        return `<strong>${params.name}</strong><br/>Level: ${params.value}%`;
      },
    },
  };
};
