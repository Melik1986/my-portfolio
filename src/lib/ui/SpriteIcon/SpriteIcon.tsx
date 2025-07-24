import React from 'react';
import { SpriteIconProps } from '@/types/sprite-icon.types';

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
