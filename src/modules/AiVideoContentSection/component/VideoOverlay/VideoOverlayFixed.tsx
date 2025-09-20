'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './VideoOverlay.module.scss';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export interface VideoOverlayFixedProps {
  isOpen: boolean;
  src: string | null;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * Исправленная версия VideoOverlay с поддержкой fullscreen
 * Использует React Portal для рендера вне GSAP контейнеров
 */
export function VideoOverlayFixed({ isOpen, src, onClose, videoRef }: VideoOverlayFixedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Инициализация portal контейнера
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortalContainer(document.body);
    }
  }, []);

  // Обработка fullscreen API
  const handleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        // Входим в fullscreen
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          await (video as any).webkitRequestFullscreen();
        } else if ((video as any).mozRequestFullScreen) {
          await (video as any).mozRequestFullScreen();
        } else if ((video as any).msRequestFullscreen) {
          await (video as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Выходим из fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen API error:', err);
    }
  }, [videoRef]);

  // Обработка двойного клика для fullscreen
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    handleFullscreen();
  }, [handleFullscreen]);

  // Управление ScrollSmoother при открытии/закрытии
  useEffect(() => {
    if (!isOpen) return;

    let smoother: any = null;
    
    try {
      // Получаем экземпляр ScrollSmoother
      smoother = ScrollSmoother.get();
      
      if (smoother) {
        // Останавливаем ScrollSmoother когда overlay открыт
        smoother.paused(true);
        
        // Сохраняем текущую позицию скролла
        const scrollPosition = smoother.scrollTop();
        
        // Блокируем скролл body
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        return () => {
          // Восстанавливаем ScrollSmoother
          if (smoother) {
            smoother.paused(false);
            smoother.scrollTop(scrollPosition);
          }
          
          // Восстанавливаем скролл body
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        };
      }
    } catch (error) {
      // ScrollSmoother может быть не инициализирован
      console.log('ScrollSmoother not available');
    }

    return () => {
      if (smoother) {
        smoother.paused(false);
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Обработка ESC клавиши
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Если в fullscreen, сначала выходим из него
        if (document.fullscreenElement) {
          document.exitFullscreen().then(() => onClose());
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Слушаем изменения fullscreen состояния
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Не рендерим если overlay закрыт или нет portal контейнера
  if (!isOpen || !src || !portalContainer) return null;

  // Рендерим через portal в body, вне GSAP контейнеров
  return createPortal(
    <div 
      className={`${styles.overlay} ${styles['overlay--fixed']} ${isFullscreen ? styles['overlay--fullscreen'] : ''}`} 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      style={{ position: 'fixed' }} // Принудительно fixed позиционирование
    >
      <div
        className={styles.overlayContent}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.overlayControls}>
          <button
            type="button"
            className={styles.overlayClose}
            aria-label="Close video"
            onClick={onClose}
          >
            ×
          </button>
          <button
            type="button"
            className={styles.overlayFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={handleFullscreen}
            title={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen (F)"}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className={styles.overlayVideo}
          muted
          playsInline
          autoPlay
          controls
          onDoubleClick={handleDoubleClick}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            width: 'auto',
            height: 'auto'
          }}
        />
      </div>
    </div>,
    portalContainer
  );
}

export default VideoOverlayFixed;