'use client';

import dynamic from 'next/dynamic';
import { useHoverPreload } from '@/lib/performance/hooks/useHoverPreload';

// Динамический импорт SkillsCharts компонента
const SkillsChartsComponent = dynamic(
  () => import('./SkillsCharts').then((mod) => ({ default: mod.SkillsCharts })),
  {
    ssr: false,
    loading: () => null, // Убираем компонент загрузки согласно требованиям
  },
);

export function SkillsChartsDynamic(props: Record<string, unknown>) {
  // Предзагрузка при наведении
  useHoverPreload(() => import('./SkillsCharts'));

  return <SkillsChartsComponent {...props} />;
}

// Экспорт типов из исходного компонента
export type { SkillsCharts } from './SkillsCharts';
