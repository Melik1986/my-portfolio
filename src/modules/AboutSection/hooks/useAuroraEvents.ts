'use client';

import { useCallback } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraState } from "../types/about.types";

interface UseAuroraEventsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
}

export const useAuroraEvents = ({
  containerRef,
  setState,
  sceneManagerRef,
}: UseAuroraEventsProps) => {
  const updateMousePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      setState((prev: AuroraState) => ({
        ...prev,
        mousePosition: { x, y },
      }));
    },
    [containerRef, setState],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    },
    [updateMousePosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [updateMousePosition],
  );

  const handleResize = useCallback(() => {
    if (!containerRef.current || !sceneManagerRef.current) return;

    const { offsetWidth, offsetHeight } = containerRef.current;
    sceneManagerRef.current.resize(offsetWidth, offsetHeight);
  }, [containerRef, sceneManagerRef]);

  return {
    handleMouseMove,
    handleTouchMove,
    handleResize,
  };
};
