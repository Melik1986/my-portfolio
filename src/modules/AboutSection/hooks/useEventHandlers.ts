import { useEffect, useCallback, useRef } from 'react';
import type { PerspectiveCamera, WebGLRenderer } from 'three';

interface EventHandlersParams {
  containerRef: React.RefObject<HTMLDivElement>;
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  rendererRef: React.RefObject<WebGLRenderer | null>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  startAnimation: () => void;
  stopAnimation: () => void;
  isInitialized: boolean;
}

const subscribeEvents = (
  container: HTMLDivElement | null,
  handleResize: () => void,
  handlePointerMove: (clientX: number, clientY: number) => void,
  startAnimation: () => void,
  stopAnimation: () => void,
) => {
  const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  container?.addEventListener('mousemove', onMouseMove);
  container?.addEventListener('touchmove', onTouchMove, { passive: false });

  return () => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    container?.removeEventListener('mousemove', onMouseMove);
    container?.removeEventListener('touchmove', onTouchMove);
  };
};

/**
 * Хук для управления всеми обработчиками событий.
 * @param params - Параметры и коллбэки для обработки событий.
 */
export const useEventHandlers = ({
  containerRef,
  cameraRef,
  rendererRef,
  mouseRef,
  startAnimation,
  stopAnimation,
  isInitialized,
}: EventHandlersParams) => {
  // Кэшируем rect для оптимизации производительности
  const rectRef = useRef<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      rectRef.current = container.getBoundingClientRect();
    }
  }, [containerRef]);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      const mouse = mouseRef.current;
      const rect = rectRef.current;
      if (!container || !mouse || !rect) return;

      mouse.x = clientX - rect.left - container.offsetWidth / 2;
      mouse.y = clientY - rect.top - container.offsetHeight / 2;
    },
    [containerRef, mouseRef],
  );

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!container || !camera || !renderer) return;

    // Обновляем кэшированный rect при изменении размера
    updateRect();

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }, [containerRef, cameraRef, rendererRef]);

  useEffect(() => {
    if (!isInitialized) return;

    // Инициализируем rect при подписке на события
    updateRect();

    return subscribeEvents(
      containerRef.current,
      handleResize,
      handlePointerMove,
      startAnimation,
      stopAnimation,
    );
  }, [
    isInitialized,
    handleResize,
    handlePointerMove,
    startAnimation,
    stopAnimation,
    containerRef,
    updateRect,
  ]);
};
