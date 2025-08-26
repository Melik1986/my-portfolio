'use client';

import React from 'react';
import { AiVideoContentProps } from './types/AiVideoContent.types';
import { VideoMarqueeGroup, VideoOverlay } from './component';
import {
  DEFAULT_VIDEO_ROWS,
  DEFAULT_VIDEO_DESCRIPTION,
} from './constants/AiVideoContent.constants';
import { HorizontalMarquee, ContentSection } from '../AiContentSection/component';
import styles from '../AiContentSection/AiContentSection.module.scss';
import { AI_CONTENT_CONSTANTS } from '../AiContentSection/constants/AiContent.constants';
import groupStyles from './component/VideoMarqueeGroup/VideoMarqueeGroup.module.scss';
import { useVideoOverlay } from './hooks/useVideoOverlay';
import { useI18n } from '@/i18n';

export function AiVideoContentSection({
  horizontalTexts = AI_CONTENT_CONSTANTS.DEFAULT_HORIZONTAL_TEXTS,
  videoRows = DEFAULT_VIDEO_ROWS,
  title = AI_CONTENT_CONSTANTS.DEFAULT_TITLE,
  description = DEFAULT_VIDEO_DESCRIPTION,
  className = '',
}: AiVideoContentProps) {
  const { t } = useI18n();
  const { containerRef, overlayVideoRef, state, onContainerClick, closeOverlay } =
    useVideoOverlay();
  return (
    <section className={`${styles['ai-content']} ${className}`} id="ai-video-content-section">
      <h2 className={`${styles['ai-content__title']} visually-hidden`}>
        {title === 'ai.title' ? t('ai.title') : title || 'AI Video Content'}
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
            <div
              ref={containerRef}
              onClick={onContainerClick}
              className={groupStyles['ai-content__overlay-anchor']}
            >
              <VideoMarqueeGroup rows={videoRows} />
              <VideoOverlay
                isOpen={state.isOpen}
                src={state.activeSrc}
                onClose={closeOverlay}
                videoRef={overlayVideoRef}
              />
            </div>
          </div>
          <ContentSection
            title={title === 'ai.title' ? t('ai.title') : title}
            description={
              description === DEFAULT_VIDEO_DESCRIPTION ? t('ai.video.description') : description
            }
          />
        </div>
      </div>
    </section>
  );
}
