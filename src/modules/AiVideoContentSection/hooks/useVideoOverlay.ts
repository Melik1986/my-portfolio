'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseVideoOverlayState {
  isOpen: boolean;
  activeSrc: string | null;
  activeTime: number;
  playbackRate: number;
}

export interface UseVideoOverlayApi {
  containerRef: React.RefObject<HTMLDivElement | null>;
  overlayVideoRef: React.RefObject<HTMLVideoElement | null>;
  state: UseVideoOverlayState;
  onContainerClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  closeOverlay: () => void;
}

type OverlayLifecycleConfig = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  overlayVideoRef: React.RefObject<HTMLVideoElement | null>;
  isOpen: boolean;
  activeTime: number;
  playbackRate: number;
};

function useOverlayLifecycle({
  containerRef,
  overlayVideoRef,
  isOpen,
  activeTime,
  playbackRate,
}: OverlayLifecycleConfig) {
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    const videoEl = overlayVideoRef.current;
    if (!container || !videoEl) return;

    const prevPosition = container.style.position;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    const onLoaded = () => {
      try {
        if (Number.isFinite(activeTime)) {
          videoEl.currentTime = activeTime;
        }
        videoEl.playbackRate = playbackRate;
        void videoEl.play().catch(() => {});
      } catch {}
    };
    videoEl.addEventListener('loadedmetadata', onLoaded, { once: true });

    return () => {
      videoEl.removeEventListener('loadedmetadata', onLoaded);
      container.style.position = prevPosition;
    };
  }, [containerRef, overlayVideoRef, isOpen, activeTime, playbackRate]);
}

function useOverlayClickHandler(
  setActiveTime: React.Dispatch<React.SetStateAction<number>>,
  setPlaybackRate: React.Dispatch<React.SetStateAction<number>>,
  setActiveSrc: React.Dispatch<React.SetStateAction<string | null>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  return useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const video = target.closest('video') as HTMLVideoElement | null;
      if (!video) return;

      const src = (video.currentSrc || video.src) ?? '';
      if (!src) return;

      try {
        setActiveTime(Number.isFinite(video.currentTime) ? video.currentTime : 0);
        setPlaybackRate(video.playbackRate || 1);
      } catch {
        setActiveTime(0);
        setPlaybackRate(1);
      }
      setActiveSrc(src);
      setIsOpen(true);
    },
    [setActiveTime, setPlaybackRate, setActiveSrc, setIsOpen],
  );
}

export const useVideoOverlay = (): UseVideoOverlayApi => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const onContainerClick = useOverlayClickHandler(
    setActiveTime,
    setPlaybackRate,
    setActiveSrc,
    setIsOpen,
  );

  useOverlayLifecycle({
    containerRef,
    overlayVideoRef,
    isOpen,
    activeTime,
    playbackRate,
  });

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    setActiveSrc(null);
  }, []);

  return {
    containerRef,
    overlayVideoRef,
    state: { isOpen, activeSrc, activeTime, playbackRate },
    onContainerClick,
    closeOverlay,
  };
};
