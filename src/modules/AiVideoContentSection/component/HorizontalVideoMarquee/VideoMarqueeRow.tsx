'use client';
import React, { useCallback, useRef } from 'react';
import trackStyles from '../../../lib/ui/HorizontalMarquee/HorizontalMarquee.module.scss';
import { useMarqueeVisibility } from '../../../lib/hooks/useMarqueeVisibility';
import { useCssVarOnResize } from '../../../lib/hooks/useCssVarOnResize';

interface VideoMarqueeRowProps {
  items: string[];
  className?: string;
  alternate?: boolean;
}

const getTrackClass = (alt: boolean): string =>
  alt
    ? `${trackStyles['ai-content__track']} ${trackStyles['ai-content__track-alt']}`
    : `${trackStyles['ai-content__track']} ${trackStyles['ai-content__track-horizontal']}`;

const computeHalfWidth = (el: HTMLUListElement): number | null => {
  const half = el.scrollWidth / 2;
  return half > 0 ? half : null;
};

export function VideoMarqueeRow({ items, className = '', alternate = false }: VideoMarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  useMarqueeVisibility(containerRef);
  const computeWidth = useCallback(computeHalfWidth, []);
  useCssVarOnResize(trackRef, '--single-set-width', computeWidth);

  const loop = [...items, ...items];
  const originalCount = items.length;
  const trackClassName = getTrackClass(alternate);

  return (
    <div ref={containerRef} className={`${trackStyles['ai-content__horizontal']} ${className}`}>
      <ul ref={trackRef} className={trackClassName}>
        {loop.map((src, index) => {
          const isClone = index >= originalCount;
          return (
            <li key={`${index}-${src}`} aria-hidden={isClone}>
              <video
                width={400}
                height={180}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                src={src}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default VideoMarqueeRow;