'use client';
import React, { useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './VerticalMarquee.module.scss';
import { useI18n } from '@/i18n';
import { useMarqueeVisibility } from '../../../../lib/hooks/useMarqueeVisibility';
import { useCssVarOnResize } from '../../../../lib/hooks/useCssVarOnResize';

interface VerticalMarqueeProps {
  images: string[];
  className?: string;
  eagerFirst?: boolean;
}

function VerticalImage({ src, index, eagerFirst }: { src: string; index: number; eagerFirst: boolean }) {
  const { t } = useI18n();
  return (
    <Image
      className={styles['ai-content__image']}
      src={src}
      alt={`${t('section.ai.posterAlt')} ${index + 1}`}
      width={210}
      height={280}
      loading={eagerFirst && index === 0 ? 'eager' : 'lazy'}
    />
  );
}

export function VerticalMarquee({
  images,
  className = '',
  eagerFirst = true,
}: VerticalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Управление паузой анимации по видимости контейнера
  useMarqueeVisibility(containerRef);

  // Установка CSS переменной высоты одного набора элементов
  const computeHeight = useCallback((el: HTMLDivElement) => {
    const half = el.scrollHeight / 2;
    return half > 0 ? half : null;
  }, []);
  useCssVarOnResize(trackRef, '--single-set-height', computeHeight);

  // Duplicate images for seamless loop
  const loopImages = [...images, ...images];
  const originalCount = images.length;

  return (
    <div
      ref={containerRef}
      className={`${styles['ai-content__horizontal']} ${styles['ai-content__horizontal-vertical']} ${className}`}
    >
      <div className={styles['ai-content__cover']}></div>
      <div
        ref={trackRef}
        className={`${styles['ai-content__track']} ${styles['ai-content__track-vertical']}`}
      >
        <div className={styles['ai-content__vertical']}>
          {loopImages.map((src, index) => {
            const isClone = index >= originalCount;
            return (
              <div
                key={`${index}-${src}`}
                className={`${styles['ai-content__picture']}${index === 0 ? ' ' + styles['ai-content__picture-main'] : ''}`}
                {...(isClone && { 'aria-hidden': true })}
              >
                <VerticalImage src={src} index={index} eagerFirst={eagerFirst} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
