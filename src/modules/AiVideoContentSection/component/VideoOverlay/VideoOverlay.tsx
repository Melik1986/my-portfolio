'use client';

import React from 'react';
import styles from './VideoOverlay.module.scss';

export interface VideoOverlayProps {
  isOpen: boolean;
  src: string | null;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function VideoOverlay({ isOpen, src, onClose, videoRef }: VideoOverlayProps) {
  if (!isOpen || !src) return null;
  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.overlayContent}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className={styles.overlayVideo}
          muted
          playsInline
          autoPlay
          controls
        />
      </div>
    </div>
  );
}

export default VideoOverlay;
