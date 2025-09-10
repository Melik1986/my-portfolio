'use client';

import dynamic from 'next/dynamic';
import { useHoverPreload } from '@/lib/performance/hooks/useHoverPreload';

// Динамический импорт 3DAvatar компонента
const Avatar3D = dynamic(() => import('./3DAvatar'), {
  ssr: false,
  loading: () => null, // Убираем компонент загрузки согласно требованиям
});

export function AvatarDynamic(props: Record<string, unknown>) {
  // Предзагрузка при наведении
  useHoverPreload(() => import('./3DAvatar'));

  return <Avatar3D {...props} />;
}

// Экспорт типов из исходного компонента
export type { Avatar as Avatar3DComponent } from './3DAvatar';
