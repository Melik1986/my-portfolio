import React from 'react';
import styles from './HorizontalMarquee/HorizontalMarquee.module.scss';

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
  return (
    <div className={`${styles['ai-content__horizontal']} ${styles['ai-content__horizontal-center']} ${className}`}>
      <ul className={trackClassName}>
        {texts.map((text, index) => (
          <li key={index} className={styles['ai-content__text']}>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
