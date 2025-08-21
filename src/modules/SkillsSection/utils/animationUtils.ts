import * as echarts from 'echarts/core';
import { SKILLS_DATA } from '../config/skillsCharts.config';

/**
 * Запускает анимацию графиков навыков
 * Показывает данные с анимацией появления столбцов и секторов
 * @param devChart - график навыков разработки
 * @param designChart - график навыков дизайна
 */
export const playAnimation = (
  devChart: echarts.ECharts | null,
  designChart: echarts.ECharts | null,
) => {
  if (!devChart || !designChart) return;

  /** Анимация столбчатой диаграммы с задержкой появления */
  devChart.setOption({
    series: [
      {
        data: SKILLS_DATA.development.map((item) => item.score),
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100,
      },
    ],
  });

  /** Анимация круговой диаграммы с эффектом расширения */
  designChart.setOption({
    series: [
      {
        data: SKILLS_DATA.design,
        animationType: 'expansion',
        animationDuration: 1200,
        animationDelay: (idx: number) => idx * 150,
      },
    ],
  });
};

/**
 * Скрывает данные графиков с анимацией
 * Уменьшает значения до нуля с плавной анимацией исчезновения
 * @param devChart - график навыков разработки
 * @param designChart - график навыков дизайна
 */
export const hideCharts = (
  devChart: echarts.ECharts | null,
  designChart: echarts.ECharts | null,
) => {
  if (!devChart || !designChart) return;

  /** Скрытие столбчатой диаграммы с анимацией исчезновения */
  devChart.setOption({
    series: [
      {
        data: new Array(SKILLS_DATA.development.length).fill(0),
        animation: true,
        animationDuration: 800,
        animationEasing: 'cubicIn',
      },
    ],
  });

  /** Скрытие круговой диаграммы с анимацией исчезновения */
  designChart.setOption({
    series: [
      {
        data: SKILLS_DATA.design.map((item) => ({ ...item, value: 0 })),
        animationType: 'expansion',
        animationDuration: 800,
        animationEasing: 'cubicIn',
      },
    ],
  });
};

/**
 * Сбрасывает анимацию графиков
 * Скрывает данные и уничтожает экземпляры графиков
 * @param devChartRef - ссылка на график разработки
 * @param designChartRef - ссылка на график дизайна
 */
export const resetAnimation = (
  devChartRef: React.RefObject<echarts.ECharts | null>,
  designChartRef: React.RefObject<echarts.ECharts | null>,
) => {
  /** Скрывает графики и уничтожает их через секунду */
  hideCharts(devChartRef.current, designChartRef.current);
  setTimeout(() => {
    if (devChartRef.current) {
      devChartRef.current.dispose();
      devChartRef.current = null;
    }
    if (designChartRef.current) {
      designChartRef.current.dispose();
      designChartRef.current = null;
    }
  }, 1000);
};
