'use client';

import dynamic from 'next/dynamic';
import { useHoverPreload } from '@/lib/performance/hooks/useHoverPreload';
import type { VideoMarqueeGroupProps } from '../index';

// Динамический импорт VideoMarqueeGroup компонента
const VideoMarqueeGroupComponent = dynamic(
  () => import('./VideoMarqueeGroup').then((mod) => ({ default: mod.VideoMarqueeGroup })),
  {
    ssr: false,
    loading: () => null, // Убираем компонент загрузки согласно требованиям
  },
);

export function VideoMarqueeGroupDynamic(props: VideoMarqueeGroupProps) {
  // Предзагрузка при наведении
  useHoverPreload(() => import('./VideoMarqueeGroup'));

  return <VideoMarqueeGroupComponent {...props} />;
}

// Экспорт типов из исходного компонента
export type { VideoMarqueeGroupProps } from './VideoMarqueeGroup';
