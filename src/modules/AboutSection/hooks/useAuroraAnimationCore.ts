'use client';

import { useCallback } from 'react';
import { AuroraSceneManager } from '@/modules/AboutSection/utils/AuroraSceneManager';
import { AuroraConfig } from '@/modules/AboutSection/types/about.types';

interface AuroraState {
  isInitialized: boolean;
  isRunning: boolean;
  mousePosition: { x: number; y: number };
}

interface UseAuroraAnimationCoreProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  state: AuroraState;
  setState: React.Dispatch<React.SetStateAction<AuroraState>>;
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>;
  animationFrameRef: React.RefObject<number | null>;
  countRef: React.RefObject<number>;
  finalConfig: AuroraConfig;
}

export const useAuroraAnimationCore = ({
  containerRef,
  state,
  setState,
  sceneManagerRef,
  animationFrameRef,
  countRef,
  finalConfig,
}: UseAuroraAnimationCoreProps) => {
  const runAnimate = (
  state: AuroraState,
  sceneManagerRef: React.RefObject<AuroraSceneManager | null>,
  countRef: React.RefObject<number>,
  finalConfig: AuroraConfig,
  animationFrameRef: React.RefObject<number | null>
) => {
  if (!sceneManagerRef.current || !state.isRunning) return;

  sceneManagerRef.current.updateCamera(state.mousePosition.x ?? 0, state.mousePosition.y ?? 0);
  sceneManagerRef.current.updateParticles(countRef.current!);
  sceneManagerRef.current.render();

  countRef.current! += finalConfig.waveSpeed;
  animationFrameRef.current = requestAnimationFrame(() => runAnimate(state, sceneManagerRef, countRef, finalConfig, animationFrameRef));
};
const clearContainer = (container: HTMLDivElement) => { while (container.firstChild) { container.removeChild(container.firstChild); } };
const initializeAnimation = useCallback(() => { if (!containerRef.current || state.isInitialized) return; clearContainer(containerRef.current); try { sceneManagerRef.current = new AuroraSceneManager(containerRef.current, finalConfig); setState((prev) => ({ ...prev, isInitialized: true, isRunning: true })); } catch (error) { console.error('Failed to initialize aurora animation:', error); } }, [containerRef, state.isInitialized, finalConfig, sceneManagerRef, setState]);
const stopAnimation = (animationFrameRef: React.RefObject<number | null>, setState: React.Dispatch<React.SetStateAction<AuroraState>>) => { if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; } setState((prev) => ({ ...prev, isRunning: false })); };
const resumeAnimation = (state: AuroraState, setState: React.Dispatch<React.SetStateAction<AuroraState>>, initializeAnimation: () => void) => { if (state.isInitialized && !state.isRunning) { setState((prev) => ({ ...prev, isRunning: true })); } else if (!state.isInitialized) { initializeAnimation(); } };
const animate = useCallback(() => runAnimate(state, sceneManagerRef, countRef, finalConfig, animationFrameRef), [state, sceneManagerRef, countRef, finalConfig, animationFrameRef]);
return { animate, initializeAnimation, stopAnimation: () => stopAnimation(animationFrameRef, setState), resumeAnimation: () => resumeAnimation(state, setState, initializeAnimation) }; };
