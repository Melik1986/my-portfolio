import React from 'react';
import { VerticalMarquee } from '../VerticalMarquee/VerticalMarquee';
import styles from './VerticalMarqueeGroup.module.scss';

interface VerticalMarqueeGroupProps {
  columns: string[][];
  className?: string;
}

export function VerticalMarqueeGroup({ columns, className = '' }: VerticalMarqueeGroupProps) {
  return (
    <div className={`${styles['ai-content__horizontal-flex']} ${className}`}>
      {columns.slice(0, 3).map((images, idx) => (
        <VerticalMarquee key={idx} images={images} />
      ))}
    </div>
  );
}
