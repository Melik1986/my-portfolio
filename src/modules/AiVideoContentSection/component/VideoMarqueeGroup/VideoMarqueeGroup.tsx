import React from 'react';
import { VideoMarqueeRow } from '../VideoMarqueeRow/VideoMarqueeRow';
import styles from './VideoMarqueeGroup.module.scss';

interface VideoMarqueeGroupProps {
  rows: string[][];
  className?: string;
}

export function VideoMarqueeGroup({ rows, className = '' }: VideoMarqueeGroupProps) {
  return (
    <div className={`${styles['ai-content__horizontal-flex']} ${className}`}>
      {rows.slice(0, 3).map((sources, idx) => (
        <VideoMarqueeRow key={idx} sources={sources} alternate={idx === 1} />
      ))}
    </div>
  );
}
