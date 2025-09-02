'use client';

import { useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { avatarControls } from '../config/avatar3d.config';

// Хук для создания Three.js сцены
export const useSceneSetup = () => {
  const createRenderer = useCallback((container: HTMLElement): THREE.WebGLRenderer => {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (!container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }
    return renderer;
  }, []);

  const createCameraAndControls = useCallback(
    (
      renderer: THREE.WebGLRenderer,
    ): { camera: THREE.PerspectiveCamera; controls: OrbitControls } => {
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0.2, 0.5, 1);

      const controls = new OrbitControls(camera, renderer.domElement);
      Object.assign(controls, avatarControls);
      controls.update();

      return { camera, controls };
    },
    [],
  );

  const setupLighting = useCallback((scene: THREE.Scene): void => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 20, 8, 1);
    spotLight.penumbra = 0.5;
    spotLight.position.set(0, 4, 2);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(1, 1, 2);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);
  }, []);

  return { createRenderer, createCameraAndControls, setupLighting };
};