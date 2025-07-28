/**
 * Базовые стили для всех графиков
 * Определяет отступы и сетку для корректного отображения
 */
export const BASE_CHART_STYLES = {
  grid: {
    left: '8%',
    right: '8%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
};

/**
 * Стили для всплывающих подсказок графиков
 * Обеспечивает единообразный внешний вид tooltip'ов
 */
export const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  borderColor: 'transparent',
  textStyle: { color: '#000' },
  extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); border-radius: 4px;',
};

/**
 * Стили для осей графиков
 * Определяет цвет и стиль осей для лучшей читаемости
 */
export const AXIS_STYLE = {
  axisLabel: { color: '#FFFFFF' },
  axisLine: { lineStyle: { color: '#FFFFFF' } },
  axisTick: { lineStyle: { color: '#FFFFFF' } },
};
