import React, { useRef } from 'react';
import { VideoMarqueeRow } from '../VideoMarqueeRow/VideoMarqueeRow';
import styles from './VideoMarqueeGroup.module.scss';
import { MagnifierCursor } from '@/lib/ui';

export interface VideoMarqueeGroupProps {
  rows: string[][];
  className?: string;
}

export function VideoMarqueeGroup({ rows, className = '' }: VideoMarqueeGroupProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={containerRef} className={`${styles['ai-content__horizontal-flex']} ${className}`}>
      {rows.slice(0, 3).map((sources, idx) => (
        <VideoMarqueeRow key={idx} sources={sources} alternate={idx === 1} />
      ))}
      <MagnifierCursor containerRef={containerRef} zoom={2.0} size={120} />
    </div>
  );
}
