import * as echarts from 'echarts/core';
import { SKILLS_DATA } from '../config/skillsCharts.config';
import { getDevChartOptions } from '../config/devChartOptions';
import { getDesignChartOptions } from '../config/designChartOptions';

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

  // Страхуемся: если оси/серии ещё не сконфигурированы (например, после dispose/re-init), задаём базовые опции
  const devOpt = devChart.getOption?.();
  if (!devOpt?.xAxis || !devOpt?.yAxis) {
    const dom = devChart.getDom?.() as HTMLElement | null;
    const containerWidth = dom?.clientWidth || 800;
    devChart.setOption(getDevChartOptions(containerWidth), { notMerge: true });
  }
  const designOpt = designChart.getOption?.();
  if (!designOpt?.series) {
    const dom = designChart.getDom?.() as HTMLElement | null;
    const w = dom?.clientWidth || 600;
    const h = dom?.clientHeight || 400;
    designChart.setOption(getDesignChartOptions(w, h), { notMerge: true });
  }

  /** Анимация столбчатой диаграммы с задержкой появления */
  devChart.setOption({
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicOut',
    series: [
      {
        type: 'bar',
        data: SKILLS_DATA.development.map((item) => item.score),
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100,
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicOut',
      },
    ],
  });

  /** Анимация круговой диаграммы с эффектом расширения */
  designChart.setOption({
    animationDurationUpdate: 1200,
    animationEasingUpdate: 'cubicOut',
    series: [
      {
        type: 'pie',
        data: SKILLS_DATA.design,
        animationType: 'expansion',
        animationDuration: 1200,
        animationDelay: (idx: number) => idx * 150,
        animationDurationUpdate: 1200,
        animationEasingUpdate: 'cubicOut',
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

  // Страхуемся: оси/серии должны существовать для bar/pie
  const devOpt = devChart.getOption?.();
  if (!devOpt?.xAxis || !devOpt?.yAxis) {
    const dom = devChart.getDom?.() as HTMLElement | null;
    const containerWidth = dom?.clientWidth || 800;
    devChart.setOption(getDevChartOptions(containerWidth), { notMerge: true });
  }
  const designOpt = designChart.getOption?.();
  if (!designOpt?.series) {
    const dom = designChart.getDom?.() as HTMLElement | null;
    const w = dom?.clientWidth || 600;
    const h = dom?.clientHeight || 400;
    designChart.setOption(getDesignChartOptions(w, h), { notMerge: true });
  }

  /** Скрытие столбчатой диаграммы с анимацией исчезновения */
  devChart.setOption({
    animationDurationUpdate: 800,
    animationEasingUpdate: 'cubicIn',
    series: [
      {
        type: 'bar',
        data: new Array(SKILLS_DATA.development.length).fill(0),
        animation: true,
        animationDurationUpdate: 800,
        animationEasingUpdate: 'cubicIn',
      },
    ],
  });

  /** Скрытие круговой диаграммы с анимацией исчезновения */
  designChart.setOption({
    animationDurationUpdate: 800,
    animationEasingUpdate: 'cubicIn',
    series: [
      {
        type: 'pie',
        data: SKILLS_DATA.design.map((item) => ({ ...item, value: 0 })),
        animationType: 'expansion',
        animationDurationUpdate: 800,
        animationEasingUpdate: 'cubicIn',
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
