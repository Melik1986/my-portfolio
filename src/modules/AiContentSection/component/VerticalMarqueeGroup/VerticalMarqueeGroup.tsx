import React, { useRef } from 'react';
import { VerticalMarquee } from '../VerticalMarquee/VerticalMarquee';
import styles from './VerticalMarqueeGroup.module.scss';
import { MagnifierCursor } from '@/lib/ui';

interface VerticalMarqueeGroupProps {
  columns: string[][];
  className?: string;
}

export function VerticalMarqueeGroup({ columns, className = '' }: VerticalMarqueeGroupProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={containerRef} className={`${styles['ai-content__horizontal-flex']} ${className}`}>
      {columns.slice(0, 3).map((images, idx) => (
        <VerticalMarquee key={idx} images={images} />
      ))}
      {/* Magnifier limited to this group container */}
      <MagnifierCursor containerRef={containerRef} zoom={2.5} size={120} />
    </div>
  );
}
