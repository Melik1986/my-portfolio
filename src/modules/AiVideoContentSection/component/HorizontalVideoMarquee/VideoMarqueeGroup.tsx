import React from 'react';
import rowStyles from './VideoMarqueeGroup.module.scss';
import { VideoMarqueeRow } from './VideoMarqueeRow';

interface VideoMarqueeGroupProps {
  rows: string[][];
  className?: string;
}

export function VideoMarqueeGroup({ rows, className = '' }: VideoMarqueeGroupProps) {
  const [row1 = [], row2 = [], row3 = []] = rows.slice(0, 3);
  return (
    <div className={`${rowStyles['ai-content__horizontal-flex']} ${className}`}>
      <VideoMarqueeRow items={row1} />
      <VideoMarqueeRow items={row2} alternate />
      <VideoMarqueeRow items={row3} />
    </div>
  );
}

export default VideoMarqueeGroup;