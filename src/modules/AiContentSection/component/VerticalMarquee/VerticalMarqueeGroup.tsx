import React from 'react';
import { VerticalMarquee } from './VerticalMarquee';

interface VerticalMarqueeGroupProps {
  columns: string[][];
  className?: string;
}

export function VerticalMarqueeGroup({ 
  columns, 
  className = '' 
}: VerticalMarqueeGroupProps) {
  return (
    <div className={className}>
      {columns.slice(0, 3).map((images, idx) => (
        <VerticalMarquee key={idx} images={images} />
      ))}
    </div>
  );
}
