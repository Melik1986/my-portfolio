import React from 'react';
import Image from 'next/image';
import styles from './VerticalMarquee/VerticalMarquee.module.scss';

interface VerticalMarqueeProps {
  images: string[];
  className?: string;
  eagerFirst?: boolean;
}

export function VerticalMarquee({
  images,
  className = '',
  eagerFirst = true,
}: VerticalMarqueeProps) {
  return (
    <div className={`${styles['ai-content__horizontal']} ${styles['ai-content__horizontal-vertical']} ${className}`}>
      <div className={styles['ai-content__cover']}></div>
      <div className={`${styles['ai-content__track']} ${styles['ai-content__track-vertical']}`}>
        <div className={styles['ai-content__vertical']}>
          {images.map((src, index) => (
            <div
              key={index}
              className={`${styles['ai-content__picture']}${index === 0 ? ' ' + styles['ai-content__picture-main'] : ''}`}
            >
              <Image
                className={styles['ai-content__image']}
                src={src}
                alt={`AI Generated Poster ${index + 1}`}
                width={210}
                height={280}
                loading={eagerFirst && index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
