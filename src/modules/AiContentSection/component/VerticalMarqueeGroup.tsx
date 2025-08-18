import React from 'react';
import { VerticalMarquee } from './VerticalMarquee';
import styles from '../styles/AiContentSection.module.css';

interface VerticalMarqueeGroupProps {
  icons: string[];
  className?: string;
}

export function VerticalMarqueeGroup({ 
  icons, 
  className = '' 
}: VerticalMarqueeGroupProps) {
  return (
    <div className={`${styles.flexHorizontal} ${className}`}>
      {/* Vertical Marquee 1 */}
      <VerticalMarquee icons={icons} />

      {/* Vertical Marquee 2 */}
      <VerticalMarquee icons={icons} />

      {/* Vertical Marquee 3 */}
      <VerticalMarquee icons={icons} />
    </div>
  );
}
