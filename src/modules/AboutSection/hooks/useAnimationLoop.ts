import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import type { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { DEFAULT_AURORA_CONFIG } from '@/modules/AboutSection/config/aurora.config';

interface AnimationParams {
  sceneRef: React.RefObject<Scene | null>;
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  rendererRef: React.RefObject<WebGLRenderer | null>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

/**
 * Хук, управляющий циклом анимации (requestAnimationFrame).
 * @param params - Параметры, необходимые для цикла рендеринга.
 * @returns Функции для запуска и остановки анимации.
 */
export const useAnimationLoop = ({
  sceneRef,
  cameraRef,
  rendererRef,
  mouseRef,
}: AnimationParams) => {
  const frameIdRef = useRef<number | null>(null);
  const countRef = useRef(0);

  const renderScene = useCallback(() => {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const mouse = mouseRef.current;

    if (!camera || !scene || !renderer || !mouse) return;

    // Плавное движение камеры за мышью
    camera.position.x += (mouse.x - camera.position.x) * DEFAULT_AURORA_CONFIG.cameraLerp;
    camera.position.y += (-mouse.y - camera.position.y) * DEFAULT_AURORA_CONFIG.cameraLerp;
    camera.lookAt(scene.position);

    // Анимация волны частиц
    const particles = scene.children[0] as THREE.Points;
    const positions = particles.geometry.attributes.position.array as Float32Array;
    countRef.current += DEFAULT_AURORA_CONFIG.waveSpeed;

    for (let ix = 0; ix < DEFAULT_AURORA_CONFIG.amountX; ix++) {
      for (let iy = 0; iy < DEFAULT_AURORA_CONFIG.amountY; iy++) {
        const i = (ix * DEFAULT_AURORA_CONFIG.amountY + iy) * 3 + 1; // Индекс Y
        positions[i] =
          Math.sin((ix + countRef.current) * DEFAULT_AURORA_CONFIG.waveFrequencyX) *
            DEFAULT_AURORA_CONFIG.waveAmplitude +
          Math.sin((iy + countRef.current) * DEFAULT_AURORA_CONFIG.waveFrequencyY) *
            DEFAULT_AURORA_CONFIG.waveAmplitude;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }, [cameraRef, sceneRef, rendererRef, mouseRef]);

  const animate = useCallback(() => {
    renderScene();
    frameIdRef.current = requestAnimationFrame(animate);
  }, [renderScene]);

  const startAnimation = useCallback(() => {
    if (frameIdRef.current === null) {
      animate();
    }
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  return { startAnimation, stopAnimation };
};
