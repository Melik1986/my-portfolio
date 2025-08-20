'use client';
import React, { useRef, useCallback } from 'react';
import styles from './HorizontalMarquee.module.scss';
import { useMarqueeVisibility } from '../../hooks/useMarqueeVisibility';
import { useCssVarOnResize } from '../../hooks/useCssVarOnResize';

interface HorizontalMarqueeProps {
  texts: string[];
  className?: string;
  alternate?: boolean;
}

export function HorizontalMarquee({
  texts,
  className = '',
  alternate = false,
}: HorizontalMarqueeProps) {
  const trackClassName = alternate
    ? `${styles['ai-content__track']} ${styles['ai-content__track-alt']}`
    : `${styles['ai-content__track']} ${styles['ai-content__track-horizontal']}`;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);

  // Управление паузой анимации по видимости контейнера
  useMarqueeVisibility(containerRef);

  // Установка CSS переменной ширины одного набора элементов
  const computeWidth = useCallback((el: HTMLUListElement) => {
    const half = el.scrollWidth / 2;
    return half > 0 ? half : null;
  }, []);
  useCssVarOnResize(trackRef, '--single-set-width', computeWidth);

  // Duplicate items for seamless loop
  const loopTexts = [...texts, ...texts];
  const originalCount = texts.length;

  return (
    <div ref={containerRef} className={`${styles['ai-content__horizontal']} ${styles['ai-content__horizontal-center']} ${className}`}>
      <ul ref={trackRef} className={trackClassName}>
        {loopTexts.map((text, index) => {
          const isClone = index >= originalCount;
          return (
            <li
              key={`${index}-${text}`}
              className={styles['ai-content__text']}
              aria-hidden={isClone}
            >
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
