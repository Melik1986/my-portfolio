'use client';

import { useCallback, useRef } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraConfig } from '@/modules/AboutSection/types/about.types';

/**
 * Интерфейс состояния Aurora анимации
 */
interface AuroraState {
  isInitialized: boolean;
  isRunning: boolean;
  mousePosition: { x: number; y: number };
}

/**
 * Интерфейс для параметров анимации
 */
interface AnimationParams {
  currentState: AuroraState;
  managerRef: React.RefObject<AuroraSceneManager | null>;
  counterRef: React.RefObject<number>;
  config: AuroraConfig;
  frameRef: React.RefObject<number | null>;
}

/**
 * Интерфейс пропсов для основного хука Aurora анимации
 */
interface UseAuroraAnimationCoreProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  state: AuroraState;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
  animationFrameRef: React.RefObject<number | null>;
  countRef: React.RefObject<number>;
  finalConfig: AuroraConfig;
}

/**
 * Хук для основной логики Aurora анимации
 * Управляет инициализацией, запуском и остановкой анимации
 */
export const useAuroraAnimationCore = ({
  containerRef,
  state,
  setState,
  sceneManagerRef,
  animationFrameRef,
  countRef,
  finalConfig,
}: UseAuroraAnimationCoreProps) => {
  const { clearContainer } = useContainerUtils();
  const { updateAnimationState } = useAnimationUpdater();
  const { runAnimate } = useAnimationRunner(updateAnimationState);
  const { initializeAnimation } = useAnimationInitializer({
    containerRef,
    state,
    setState,
    sceneManagerRef,
    finalConfig,
    clearContainer,
  });
  const { stopAnimation } = useAnimationStopper({
    animationFrameRef,
    setState,
  });
  const { resumeAnimation } = useAnimationResumer({
    state,
    setState,
    initializeAnimation,
  });
  const { animate } = useAnimationController({
    state,
    sceneManagerRef,
    countRef,
    finalConfig,
    animationFrameRef,
    runAnimate,
  });

  return {
    animate,
    initializeAnimation,
    stopAnimation,
    resumeAnimation,
  };
};

/**
 * Утилиты для работы с контейнером
 */
const useContainerUtils = () => {
  const clearContainer = useCallback((container: HTMLDivElement) => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }, []);

  return { clearContainer };
};

/**
 * Обновление состояния анимации
 */
const useAnimationUpdater = () => {
  const updateAnimationState = useCallback((params: AnimationParams) => {
    const { currentState, managerRef, counterRef, config, frameRef } = params;

    if (!managerRef.current || !currentState.isRunning) return;

    managerRef.current.updateCamera(
      currentState.mousePosition.x ?? 0,
      currentState.mousePosition.y ?? 0,
    );
    managerRef.current.updateParticles(counterRef.current!);
    managerRef.current.render();

    counterRef.current! += config.waveSpeed;
    frameRef.current = requestAnimationFrame(() => updateAnimationState(params));
  }, []);

  return { updateAnimationState };
};

/**
 * Запуск анимации
 */
const useAnimationRunner = (updateAnimationState: (params: AnimationParams) => void) => {
  const runAnimate = useCallback(
    (params: AnimationParams) => {
      updateAnimationState(params);
    },
    [updateAnimationState],
  );

  return { runAnimate };
};

/**
 * Инициализация анимации
 */
const useAnimationInitializer = ({
  containerRef,
  state,
  setState,
  sceneManagerRef,
  finalConfig,
  clearContainer,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  state: AuroraState;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
  finalConfig: AuroraConfig;
  clearContainer: (container: HTMLDivElement) => void;
}) => {
  const initializeAnimation = useCallback(() => {
    if (!containerRef.current || state.isInitialized) return;

    clearContainer(containerRef.current);

    try {
      sceneManagerRef.current = new AuroraSceneManager(containerRef.current, finalConfig);
      setState((prev) => ({ ...prev, isInitialized: true, isRunning: true }));
    } catch (error) {
      console.error('Failed to initialize aurora animation:', error);
    }
  }, [containerRef, finalConfig, sceneManagerRef, setState, clearContainer, state.isInitialized]);

  return { initializeAnimation };
};

/**
 * Остановка анимации
 */
const useAnimationStopper = ({
  animationFrameRef,
  setState,
}: {
  animationFrameRef: React.RefObject<number | null>;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
}) => {
  const stopAnimation = useCallback(
    (updateState = true) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (updateState) {
        setState((prev) => ({ ...prev, isRunning: false }));
      }
    },
    [setState, animationFrameRef],
  );

  return { stopAnimation };
};

/**
 * Возобновление анимации
 */
const useAnimationResumer = ({
  state,
  setState,
  initializeAnimation,
}: {
  state: AuroraState;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
  initializeAnimation: () => void;
}) => {
  const stateRef = useRef(state);
  stateRef.current = state;

  const resumeAnimation = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState.isInitialized && !currentState.isRunning) {
      setState((prev) => ({ ...prev, isRunning: true }));
    } else if (!currentState.isInitialized) {
      initializeAnimation();
    }
  }, [setState, initializeAnimation]);

  return { resumeAnimation };
};

/**
 * Контроллер анимации
 */
const useAnimationController = ({
  state,
  sceneManagerRef,
  countRef,
  finalConfig,
  animationFrameRef,
  runAnimate,
}: {
  state: AuroraState;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
  countRef: React.RefObject<number>;
  finalConfig: AuroraConfig;
  animationFrameRef: React.RefObject<number | null>;
  runAnimate: (params: AnimationParams) => void;
}) => {
  const stateRef = useRef(state);
  stateRef.current = state;

  const animate = useCallback(() => {
    const params: AnimationParams = {
      currentState: stateRef.current,
      managerRef: sceneManagerRef,
      counterRef: countRef,
      config: finalConfig,
      frameRef: animationFrameRef,
    };
    runAnimate(params);
  }, [
    runAnimate,
    finalConfig,
    sceneManagerRef,
    countRef,
    animationFrameRef,
  ]);

  return { animate };
};
