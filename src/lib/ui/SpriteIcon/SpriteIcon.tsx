import React from 'react';
import { SpriteIconProps } from '@/lib/types/sprite-icon.types';

/**
 * Компонент для отображения иконок из SVG спрайта
 * Рендерит SVG элемент с ссылкой на спрайт
 */
export function SpriteIcon({
  id,
  name,
  sprite = '/sprite.svg',
  className = '',
  width,
  height,
  ...rest
}: SpriteIconProps) {
  const symbolId = id || name;
  if (!symbolId) return null;
  return (
    <svg className={className} aria-hidden="true" width={width} height={height} {...rest}>
      <use xlinkHref={`${sprite}#${symbolId}`} />
    </svg>
  );
}
