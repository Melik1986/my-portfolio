/**
 * Базовые стили для всех графиков
 * Определяет отступы и сетку для корректного отображения
 */
function readCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export const getBaseChartStyles = () => ({
  backgroundColor: readCssVar('--charts-canvas-bg', '#ffffff'),
  textStyle: { color: readCssVar('--charts-text-color', '#333333') },
  grid: {
    left: '8%',
    right: '8%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
});

/**
 * Стили для всплывающих подсказок графиков
 * Обеспечивает единообразный внешний вид tooltip'ов
 */
export const getTooltipStyle = () => ({
  backgroundColor: '#FFFFFF',
  borderColor: 'transparent',
  textStyle: { color: '#000' },
  extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); border-radius: 4px;',
});

/**
 * Стили для осей графиков
 * Определяет цвет и стиль осей для лучшей читаемости
 */
export const getAxisStyle = () => ({
  axisLabel: { color: readCssVar('--charts-text-color', '#333333') },
  axisLine: { lineStyle: { color: readCssVar('--charts-text-color', '#333333') } },
  axisTick: { lineStyle: { color: readCssVar('--charts-text-color', '#333333') } },
});
