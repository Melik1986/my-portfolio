import React from 'react';
import styles from '../styles/AiContentSection.module.css';

interface HorizontalMarqueeProps {
  texts: string[];
  className?: string;
  trackClassName?: string;
}

export function HorizontalMarquee({ 
  texts, 
  className = '',
  trackClassName = styles.marqueeTrackHorizontal
}: HorizontalMarqueeProps) {
  return (
    <div className={`${styles.marqueeHorizontal} ${className}`}>
      <div className={trackClassName}>
        {texts.map((text, index) => (
          <div key={index} className={styles.marqueeText}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
