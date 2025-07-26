'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { SELECTORS, COLOR_PALETTE, SKILLS_DATA, RESPONSIVE_BREAKPOINTS } from '../config/skillsCharts.config';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  CanvasRenderer,
]);

const BASE_CHART_STYLES = {
  grid: {
    left: '8%',
    right: '8%',
    bottom: '15%',
    top: '10%',
    containLabel: true,
  },
};

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  borderColor: 'transparent',
  textStyle: { color: '#000' },
  extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); border-radius: 4px;',
};

const AXIS_STYLE = {
  axisLabel: { color: '#FFFFFF' },
  axisLine: { lineStyle: { color: '#FFFFFF' } },
  axisTick: { lineStyle: { color: '#FFFFFF' } },
};

export const useSkillsCharts = () => {
  const devChartRef = useRef<echarts.ECharts | null>(null);
  const designChartRef = useRef<echarts.ECharts | null>(null);

  const initializeCharts = () => {
    const devChartElement = document.querySelector(SELECTORS.DEV_CHART) as HTMLElement | null;
    const designChartElement = document.querySelector(SELECTORS.DESIGN_CHART) as HTMLElement | null;

    if (!devChartElement || !designChartElement) return;

    devChartRef.current = echarts.init(devChartElement);
    designChartRef.current = echarts.init(designChartElement);

    const containerWidth = devChartElement.offsetWidth;
    const barWidth = Math.max(25, Math.min(45, containerWidth / 12));
    const fontSize = containerWidth < RESPONSIVE_BREAKPOINTS.mobile ? 10 : containerWidth < RESPONSIVE_BREAKPOINTS.tablet ? 11 : 12;
    const labelRotation = containerWidth < RESPONSIVE_BREAKPOINTS.tablet ? 45 : 0;

    const barChartOptions = {
      ...BASE_CHART_STYLES,
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        formatter: (params: any) => {
          const data = params[0];
          return `<strong>${data.name}</strong><br/>Level: ${data.value}%`;
        },
      },
      xAxis: {
        type: 'category',
        data: SKILLS_DATA.development.map((item) => item.skill),
        ...AXIS_STYLE,
        axisLabel: {
          ...AXIS_STYLE.axisLabel,
          rotate: labelRotation,
          fontSize,
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
        ...AXIS_STYLE,
        axisLabel: {
          ...AXIS_STYLE.axisLabel,
          formatter: '{value}%',
        },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
      },
      series: [
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
      ],
    };

    devChartRef.current.setOption(barChartOptions);

    const designWidth = designChartElement.offsetWidth;
    const designHeight = designChartElement.offsetHeight;
    const minDimension = Math.min(designWidth, designHeight);
    const radius = Math.max(100, minDimension * 0.35);
    const legendFontSize = designWidth < RESPONSIVE_BREAKPOINTS.mobile ? 10 : designWidth < RESPONSIVE_BREAKPOINTS.tablet ? 11 : 12;

    const pieChartOptions = {
      legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        textStyle: { color: '#FFFFFF', fontSize: legendFontSize },
        data: SKILLS_DATA.design.map((item) => item.name),
      },
      series: [
        {
          name: 'Design Skills',
          type: 'pie',
          radius: [0, radius],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: { borderRadius: 8 },
          label: { show: false },
          labelLine: { show: false },
          data: SKILLS_DATA.design.map((item) => ({ value: 0, name: item.name })),
          animationType: 'expansion',
          animationDuration: 1200,
          animationDelay: (idx: number) => idx * 150,
        },
      ],
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: (params: any) => `<strong>${params.name}</strong><br/>Level: ${params.value}%`,
      },
    };

    designChartRef.current.setOption(pieChartOptions);
  };

  const playAnimation = () => {
    if (!devChartRef.current || !designChartRef.current) return;

    devChartRef.current.setOption({
      series: [{
        data: SKILLS_DATA.development.map((item) => item.score),
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100,
      }],
    });

    designChartRef.current.setOption({
      series: [{
        data: SKILLS_DATA.design,
        animationType: 'expansion',
        animationDuration: 1200,
        animationDelay: (idx: number) => idx * 150,
      }],
    });
  };

  const hideCharts = () => {
    if (!devChartRef.current || !designChartRef.current) return;

    devChartRef.current.setOption({
      series: [{
        data: new Array(SKILLS_DATA.development.length).fill(0),
        animation: true,
        animationDuration: 800,
        animationEasing: 'cubicIn',
      }],
    });

    designChartRef.current.setOption({
      series: [{
        data: SKILLS_DATA.design.map((item) => ({ ...item, value: 0 })),
        animationType: 'expansion',
        animationDuration: 800,
        animationEasing: 'cubicIn',
      }],
    });
  };

  const resetAnimation = () => {
    hideCharts();
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

  const resizeCharts = () => {
    if (!devChartRef.current || !designChartRef.current) return;

    const devChartElement = document.querySelector(SELECTORS.DEV_CHART) as HTMLElement | null;
    const designChartElement = document.querySelector(SELECTORS.DESIGN_CHART) as HTMLElement | null;

    if (!devChartElement || !designChartElement) return;

    const containerWidth = devChartElement.offsetWidth;
    const barWidth = Math.max(25, Math.min(45, containerWidth / 12));
    const fontSize = containerWidth < RESPONSIVE_BREAKPOINTS.mobile ? 10 : containerWidth < RESPONSIVE_BREAKPOINTS.tablet ? 11 : 12;
    const labelRotation = containerWidth < RESPONSIVE_BREAKPOINTS.tablet ? 45 : 0;

    devChartRef.current.setOption({
      xAxis: {
        axisLabel: { fontSize, rotate: labelRotation },
      },
      series: [{ barWidth, barGap: 15 }],
    });
    devChartRef.current.resize();

    const designWidth = designChartElement.offsetWidth;
    const designHeight = designChartElement.offsetHeight;
    const minDimension = Math.min(designWidth, designHeight);
    const radius = Math.max(100, minDimension * 0.35);
    const legendFontSize = designWidth < RESPONSIVE_BREAKPOINTS.mobile ? 10 : designWidth < RESPONSIVE_BREAKPOINTS.tablet ? 11 : 12;

    designChartRef.current.setOption({
      legend: {
        textStyle: { fontSize: legendFontSize },
      },
      series: [{ radius: [0, radius] }],
    });
    designChartRef.current.resize();
  };

  useEffect(() => {
    initializeCharts();
    window.addEventListener('resize', resizeCharts);
    return () => {
      window.removeEventListener('resize', resizeCharts);
      if (devChartRef.current) devChartRef.current.dispose();
      if (designChartRef.current) designChartRef.current.dispose();
    };
  }, []);

  return { initializeCharts, playAnimation, hideCharts, resetAnimation, resizeCharts };
};