'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { VideoOverlayProps } from './VideoOverlay';

// Динамический импорт VideoOverlay компонента
const VideoOverlayComponent = dynamic(
  () => import('./VideoOverlay').then((mod) => ({ default: mod.VideoOverlay })),
  {
    ssr: false,
    loading: () => null, // Убираем компонент загрузки согласно требованиям
  },
);

export function VideoOverlayDynamic(props: VideoOverlayProps) {
  // Предзагрузка при открытии оверлея
  React.useEffect(() => {
    if (props.isOpen) {
      import('./VideoOverlay');
    }
  }, [props.isOpen]);

  return <VideoOverlayComponent {...props} />;
}

// Экспорт типов из исходного компонента
export type { VideoOverlayProps } from './VideoOverlay';
