'use client';

import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { readCssVar } from '../utils/avatar.utils';
import { AvatarAssets } from '../types/avatar.types';

// Хук для работы с 3D моделью
export const useModelLoader = () => {
  const createGround = useCallback((): THREE.Mesh => {
    const geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
    const podiumColor = readCssVar('--avatar-podium-color', '#e0e0e0');
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(podiumColor),
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;
    mesh.position.y = -0.05;

    return mesh;
  }, []);

  const setupAnimations = useCallback(
    (
      gltf: GLTF,
      mixer: THREE.AnimationMixer,
    ): {
      waveAction: THREE.AnimationAction | null;
      stumbleAction: THREE.AnimationAction | null;
    } => {
      const waveClip =
        THREE.AnimationClip.findByName(gltf.animations, 'Waving') || gltf.animations[0];
      const stumbleClip =
        THREE.AnimationClip.findByName(gltf.animations, 'Stagger') || gltf.animations[1];

      return {
        waveAction: waveClip ? mixer.clipAction(waveClip) : null,
        stumbleAction: stumbleClip ? mixer.clipAction(stumbleClip) : null,
      };
    },
    [],
  );

  const setupMeshProperties = useCallback((avatar: THREE.Group): void => {
    avatar.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, []);

  return { createGround, setupAnimations, setupMeshProperties };
};

// Хук для наблюдения за темой
export const useThemeObserverEffect = (refs: React.RefObject<AvatarAssets | null>) => {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const groundMesh = refs.current?.groundMesh;
          if (groundMesh) {
            const podiumColor = readCssVar('--avatar-podium-color', '#e0e0e0');
            (groundMesh.material as THREE.MeshStandardMaterial).color.set(
              new THREE.Color(podiumColor),
            );
          }
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [refs]);
};
