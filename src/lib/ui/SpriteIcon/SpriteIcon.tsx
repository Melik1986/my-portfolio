import React from 'react';
import { SpriteIconProps } from '@/types/sprite-icon.types';

/**
 * Компонент для отображения иконок из SVG спрайта
 * Рендерит SVG элемент с ссылкой на спрайт
 */
export function SpriteIcon({ id, className = '', width, height, ...rest }: SpriteIconProps) {
  if (!id) {
    return null;
  }
  return (
    <svg className={className} aria-hidden="true" width={width} height={height} {...rest}>
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
}
