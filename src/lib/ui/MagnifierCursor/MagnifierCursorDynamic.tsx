'use client';

import dynamic from 'next/dynamic';
import { useHoverPreload } from '@/lib/performance/hooks/useHoverPreload';
import type { MagnifierCursorProps } from './MagnifierCursor';

// Динамический импорт MagnifierCursor компонента
const MagnifierCursorComponent = dynamic(
  () => import('./MagnifierCursor').then((mod) => ({ default: mod.MagnifierCursor })),
  {
    ssr: false,
    loading: () => null, // Убираем компонент загрузки согласно требованиям
  },
);

export function MagnifierCursorDynamic(props: MagnifierCursorProps) {
  // Предзагрузка при наведении
  useHoverPreload(() => import('./MagnifierCursor'));

  return <MagnifierCursorComponent {...props} />;
}

// Экспорт типов из исходного компонента
export type { MagnifierCursorProps } from './MagnifierCursor';
