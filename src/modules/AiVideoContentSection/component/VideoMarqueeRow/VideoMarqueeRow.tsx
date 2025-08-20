'use client';
import React, { useRef, useCallback } from 'react';
import styles from '../../../../lib/ui/HorizontalMarquee/HorizontalMarquee.module.scss';
import videoStyles from './VideoMarqueeRow.module.scss';
import { useMarqueeVisibility } from '../../../../lib/hooks/useMarqueeVisibility';
import { useCssVarOnResize } from '../../../../lib/hooks/useCssVarOnResize';

interface VideoMarqueeRowProps {
  sources: string[];
  className?: string;
  alternate?: boolean;
}

const renderVideoItem = (src: string, index: number, isClone: boolean) => (
  <li key={`${index}-${src}`}>
    <video
      src={src}
      className={videoStyles['video-marquee-row__video']}
      muted
      loop
      playsInline
      preload="metadata"
      autoPlay
      aria-hidden={isClone}
      onError={(e) => {
        console.warn('Video failed to load:', src);
        e.currentTarget.style.display = 'none';
      }}
      onLoadStart={() => {
        // Ensure video dimensions are set
      }}
    />
  </li>
);

export function VideoMarqueeRow({
  sources,
  className = '',
  alternate = false,
}: VideoMarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  useMarqueeVisibility(containerRef);

  const computeWidth = useCallback((el: HTMLUListElement) => {
    const half = el.scrollWidth / 2;
    return half > 0 ? half : null;
  }, []);
  useCssVarOnResize(trackRef, '--single-set-width', computeWidth);

  const loopSources = [...sources, ...sources];
  const originalCount = sources.length;

  const trackClassName = alternate
    ? `${styles['ai-content__track']} ${styles['ai-content__track-alt']}`
    : `${styles['ai-content__track']} ${styles['ai-content__track-horizontal']}`;

  return (
    <div 
      ref={containerRef} 
      className={`${styles['ai-content__horizontal']} ${videoStyles['video-marquee-row']} ${className}`}
    >
      <ul ref={trackRef} className={trackClassName}>
        {loopSources.map((src, index) => {
          const isClone = index >= originalCount;
          return renderVideoItem(src, index, isClone);
        })}
      </ul>
    </div>
  );
}