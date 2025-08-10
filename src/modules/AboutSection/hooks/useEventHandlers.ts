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

// Конфигурация для подписки на события
interface EventConfig {
  container: HTMLDivElement | null;
  handleResize: () => void;
  handlePointerMove: (clientX: number, clientY: number) => void;
  startAnimation: () => void;
  stopAnimation: () => void;
}

// Обработчик изменения видимости страницы
const createVisibilityHandler = (startAnimation: () => void, stopAnimation: () => void) => {
  return () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };
};

// Обработчик движения мыши
const createMouseHandler = (handlePointerMove: (clientX: number, clientY: number) => void) => {
  return (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
};

// Обработчик касания
const createTouchHandler = (handlePointerMove: (clientX: number, clientY: number) => void) => {
  return (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
};

// Подписка на события с меньшим количеством параметров
const subscribeEvents = (config: EventConfig) => {
  const { container, handleResize, handlePointerMove, startAnimation, stopAnimation } = config;
  
  const onMouseMove = createMouseHandler(handlePointerMove);
  const onTouchMove = createTouchHandler(handlePointerMove);
  const handleVisibilityChange = createVisibilityHandler(startAnimation, stopAnimation);

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

// Функция для обработки движения указателя
const createPointerMoveHandler = (
  containerRef: React.RefObject<HTMLDivElement>,
  mouseRef: React.RefObject<{ x: number; y: number }>,
  rectRef: React.MutableRefObject<DOMRect | null>,
) => {
  return useCallback(
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
};

// Функция для обработки изменения размера
const createResizeHandler = (
  containerRef: React.RefObject<HTMLDivElement>,
  cameraRef: React.RefObject<PerspectiveCamera | null>,
  rendererRef: React.RefObject<WebGLRenderer | null>,
  updateRect: () => void,
) => {
  return useCallback(() => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!container || !camera || !renderer) return;

    updateRect();

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }, [containerRef, cameraRef, rendererRef, updateRect]);
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
  const rectRef = useRef<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      rectRef.current = container.getBoundingClientRect();
    }
  }, [containerRef]);

  const handlePointerMove = createPointerMoveHandler(containerRef, mouseRef, rectRef);
  const handleResize = createResizeHandler(containerRef, cameraRef, rendererRef, updateRect);

  useEffect(() => {
    if (!isInitialized) return;

    updateRect();

    return subscribeEvents({
      container: containerRef.current,
      handleResize,
      handlePointerMove,
      startAnimation,
      stopAnimation,
    });
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
