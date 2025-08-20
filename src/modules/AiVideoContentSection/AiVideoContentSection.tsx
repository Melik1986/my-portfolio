'use client';

import React from 'react';
import { AiVideoContentProps } from './types/AiVideoContent.types';
import { VideoMarqueeGroup } from './component/VideoMarqueeGroup/VideoMarqueeGroup';
import { DEFAULT_VIDEO_ROWS } from './constants/AiVideoContent.constants';
import { HorizontalMarquee, ContentSection } from '../AiContentSection/component';
import styles from '../AiContentSection/AiContentSection.module.scss';
import { AI_CONTENT_CONSTANTS } from '../AiContentSection/constants/AiContent.constants';
import groupStyles from './component/VideoMarqueeGroup/VideoMarqueeGroup.module.scss';

export function AiVideoContentSection({
  horizontalTexts = AI_CONTENT_CONSTANTS.DEFAULT_HORIZONTAL_TEXTS,
  videoRows = DEFAULT_VIDEO_ROWS,
  title = AI_CONTENT_CONSTANTS.DEFAULT_TITLE,
  description = AI_CONTENT_CONSTANTS.DEFAULT_DESCRIPTION,
  className = '',
}: AiVideoContentProps) {
  return (
    <section className={`${styles['ai-content']} ${className}`} id="ai-video-content-section">
      <h2 className={`${styles['ai-content__title']} visually-hidden`}>
        {title || 'AI Video Content'}
      </h2>

      <div className={styles['ai-content__marquee-container']}>
        <HorizontalMarquee texts={horizontalTexts} />
        <HorizontalMarquee texts={horizontalTexts} alternate />
      </div>

      <div
        className={`${styles['ai-content__container']} ${styles['ai-content__container-vertical']}`}
      >
        <div className={styles['ai-content__wrapper']}>
          <div
            className={`${styles['ai-content__horizontal']} ${groupStyles['ai-content__horizontal-flex']}`}
            data-animation="zoom-in"
            data-duration="1.5"
            data-ease="back.out(1.7)"
            data-delay="0.2"
          >
            <VideoMarqueeGroup rows={videoRows} />
          </div>
          <ContentSection title={title} description={description} />
        </div>
      </div>
    </section>
  );
}

export default AiVideoContentSection;
