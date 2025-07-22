import React from 'react';
import { SpriteIconProps } from '@/types/sprite-icon.types';

export function SpriteIcon({ id, className = '' }: SpriteIconProps) {
  if (!id) {
    return null;
  }
  return (
    <svg className={className} aria-hidden="true">
      <use xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
}
