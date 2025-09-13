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
  // Закрытие по клавише Esc только когда оверлей открыт
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;
  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.overlayContent}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.overlayClose}
          aria-label="Close video"
          onClick={onClose}
        >
          ×
        </button>
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className={styles.overlayVideo}
          muted
          playsInline
          autoPlay
          controls
          {...({ 'webkit-playsinline': '' } as React.VideoHTMLAttributes<HTMLVideoElement>)}
        />
      </div>
    </div>
  );
}

export default VideoOverlay;
