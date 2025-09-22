'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './VideoOverlay.module.scss';

// Проверка наличия GSAP в глобальном контексте
const getGSAPInstances = () => {
  if (typeof window === 'undefined') return { gsap: null, ScrollSmoother: null };
  
  try {
    const gsap = (window as any).gsap;
    const ScrollSmoother = gsap?.plugins?.find((p: any) => p.name === 'ScrollSmoother');
    return { gsap, ScrollSmoother };
  } catch {
    return { gsap: null, ScrollSmoother: null };
  }
};

export interface VideoOverlayFixedProps {
  isOpen: boolean;
  src: string | null;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function VideoOverlayFixed({ isOpen, src, onClose, videoRef }: VideoOverlayFixedProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const gsapStateRef = useRef<{
    smootherPaused: boolean;
    globalTimelinePaused: boolean;
    scrollTriggerEnabled: boolean;
  }>({
    smootherPaused: false,
    globalTimelinePaused: false,
    scrollTriggerEnabled: true,
  });

  // Создание и управление portal контейнером
  useEffect(() => {
    if (!isOpen) {
      setPortalContainer(null);
      return;
    }

    // Создаем изолированный контейнер для portal
    const container = document.createElement('div');
    container.id = 'video-overlay-portal';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 999999;
      isolation: isolate;
    `;
    document.body.appendChild(container);
    setPortalContainer(container);

    // Блокируем скролл body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Управление GSAP при открытии/закрытии оверлея
  useEffect(() => {
    if (!isOpen) return;

    const { gsap, ScrollSmoother } = getGSAPInstances();
    const state = gsapStateRef.current;

    // Приостанавливаем ScrollSmoother
    try {
      if (ScrollSmoother && typeof ScrollSmoother.get === 'function') {
        const smoother = ScrollSmoother.get();
        if (smoother) {
          state.smootherPaused = smoother.paused();
          if (!state.smootherPaused) {
            smoother.paused(true);
          }
        }
      }
    } catch (error) {
      console.warn('ScrollSmoother pause failed:', error);
    }

    // Приостанавливаем глобальный timeline GSAP
    try {
      if (gsap && gsap.globalTimeline) {
        state.globalTimelinePaused = gsap.globalTimeline.paused();
        if (!state.globalTimelinePaused) {
          gsap.globalTimeline.pause();
        }
      }
    } catch (error) {
      console.warn('GSAP timeline pause failed:', error);
    }

    // Отключаем ScrollTrigger
    try {
      if (gsap && gsap.ScrollTrigger) {
        state.scrollTriggerEnabled = gsap.ScrollTrigger.enabled();
        if (state.scrollTriggerEnabled) {
          gsap.ScrollTrigger.disable();
        }
      }
    } catch (error) {
      console.warn('ScrollTrigger disable failed:', error);
    }

    // Cleanup - восстанавливаем состояние GSAP
    return () => {
      const { gsap, ScrollSmoother } = getGSAPInstances();

      // Восстанавливаем ScrollSmoother
      try {
        if (ScrollSmoother && typeof ScrollSmoother.get === 'function') {
          const smoother = ScrollSmoother.get();
          if (smoother && !state.smootherPaused) {
            smoother.paused(false);
          }
        }
      } catch (error) {
        console.warn('ScrollSmoother resume failed:', error);
      }

      // Восстанавливаем глобальный timeline
      try {
        if (gsap && gsap.globalTimeline && !state.globalTimelinePaused) {
          gsap.globalTimeline.resume();
        }
      } catch (error) {
        console.warn('GSAP timeline resume failed:', error);
      }

      // Включаем ScrollTrigger
      try {
        if (gsap && gsap.ScrollTrigger && state.scrollTriggerEnabled) {
          gsap.ScrollTrigger.enable();
          // Обновляем позиции после включения
          setTimeout(() => {
            if (gsap.ScrollTrigger) {
              gsap.ScrollTrigger.refresh();
            }
          }, 100);
        }
      } catch (error) {
        console.warn('ScrollTrigger enable failed:', error);
      }
    };
  }, [isOpen]);

  // Обработка Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Сначала выходим из fullscreen, если активен
        if (document.fullscreenElement) {
          document.exitFullscreen().then(() => {
            onClose();
          }).catch(() => {
            onClose();
          });
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Обработка fullscreen для видео
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const video = videoRef.current;
    
    // Функция для безопасного входа в fullscreen
    const enterFullscreen = async () => {
      try {
        // Небольшая задержка для стабилизации DOM
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          await (video as any).webkitRequestFullscreen();
        } else if ((video as any).mozRequestFullScreen) {
          await (video as any).mozRequestFullScreen();
        } else if ((video as any).msRequestFullscreen) {
          await (video as any).msRequestFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen request failed:', error);
      }
    };

    // Обработчик двойного клика для fullscreen
    const handleDoubleClick = () => {
      if (!document.fullscreenElement) {
        enterFullscreen();
      } else {
        document.exitFullscreen();
      }
    };

    video.addEventListener('dblclick', handleDoubleClick);

    // Cleanup
    return () => {
      video.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [isOpen, videoRef]);

  // Не рендерим, если нет portal контейнера
  if (!isOpen || !src || !portalContainer) return null;

  // Рендерим через portal для изоляции от GSAP контекста
  return createPortal(
    <div 
      className={styles.overlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        // Переопределяем стили для гарантированной изоляции
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
      }}
    >
      <div
        className={styles.overlayContent}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          // Убираем любые transform для избежания конфликтов
          transform: 'none',
          willChange: 'auto',
        }}
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
          style={{
            // Гарантируем правильное позиционирование для fullscreen
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </div>
    </div>,
    portalContainer
  );
}

export default VideoOverlayFixed;