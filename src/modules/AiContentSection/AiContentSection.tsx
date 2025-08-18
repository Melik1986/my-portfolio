'use client';

import React from 'react';
import { AiContentProps } from './types/AiContent.types';
import { HorizontalMarquee, VerticalMarqueeGroup, ContentSection } from './component';
import styles from './styles/AiContentSection.module.css';

export function AiContentSection({ 
  horizontalTexts = [], 
  verticalIcons = [], 
  subtitle = '', 
  title = '', 
  description = '', 
  className = '' 
}: AiContentProps) {

  return (
    <section className={`${styles.AiContentSection} ${className}`} id="ai-content-section">
      <h2 className={`${styles.AiContentSection__title} visually-hidden`}>{title}</h2>
      <div className={styles.spacer100}></div>

      {/* Horizontal Marquee 1 */}
      <HorizontalMarquee texts={horizontalTexts} />

      <div className={styles.spacer100}></div>

      {/* Horizontal Marquee 2 */}
      <HorizontalMarquee texts={horizontalTexts} trackClassName={styles.marqueeTrackAlt} />

      <div className={styles.spacer100}></div>

      {/* Vertical Section */}
      <div className={styles.containerVertical}>
        <div className={styles.flexHorizontal}>
          <VerticalMarqueeGroup icons={verticalIcons} />

          <div className={styles.spacer100}></div>

          {/* Content */}
          <ContentSection subtitle={subtitle} title={title} description={description} />
        </div>
      </div>
    </section>
  );
}

export default AiContentSection;
