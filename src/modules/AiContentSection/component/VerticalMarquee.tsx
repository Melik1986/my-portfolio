import React from 'react';
import Image from 'next/image';
import styles from '../styles/AiContentSection.module.css';

interface VerticalMarqueeProps {
  icons: string[];
  className?: string;
}

export function VerticalMarquee({ 
  icons, 
  className = '' 
}: VerticalMarqueeProps) {
  return (
    <div className={`${styles.marqueeVertical} ${className}`}>
      <div className={styles.marqueeCover}></div>
      <div className={styles.marqueeTrackVertical}>
        <div className={styles.flexVertical}>
          {icons.map((icon, index) => (
            <React.Fragment key={index}>
              <div className={index === 0 ? styles.iconContainerMain : styles.iconContainer}>
                <Image 
                  className={styles.icon} 
                  src={icon} 
                  alt="" 
                  width={50}
                  height={50}
                />
              </div>
              {index < icons.length - 1 && <div className={styles.spacer30}></div>}
            </React.Fragment>
          ))}
          <div className={styles.spacer30}></div>
        </div>
      </div>
    </div>
  );
}
