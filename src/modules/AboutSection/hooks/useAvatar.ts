'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { avatarConfig, avatarControls } from '../config/avatar3d.config';
import { AvatarRefs } from '../types/about.types';

// Строгая типизация для внутренней работы хука
interface AvatarScene {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls: OrbitControls;
  clock: THREE.Clock;
}

interface AvatarAssets {
  avatar: THREE.Group;
  groundMesh: THREE.Mesh;
  mixer: THREE.AnimationMixer;
  waveAction: THREE.AnimationAction | null;
  stumbleAction: THREE.AnimationAction | null;
}

interface AvatarState {
  isAnimationPlaying: boolean;
  isStumbling: boolean;
  isDisposed: boolean;
}

// Константы конфигурации
const CONFIG = {
  BASE_SIZE: 800,
  MIN_SCALE: 0.3,
  MAX_SCALE: 1.5,
  CROSS_FADE_DURATION: 0.3,
  STUMBLE_DURATION: 4000,
  RECOVERY_DURATION: 1000,
} as const;

// Хук для создания Three.js сцены
const useSceneSetup = () => {
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

    container.appendChild(renderer.domElement);
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

// Хук для работы с 3D моделью
const useModelLoader = () => {
  const readCssVar = (name: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

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

// Хук для анимационной логики
const useAnimationControl = (
  assetsRef: React.RefObject<AvatarAssets | null>,
  stateRef: React.RefObject<AvatarState>,
) => {
  const executeStumbleSequence = useCallback((): void => {
    const assets = assetsRef.current;
    const state = stateRef.current;

    if (!assets?.waveAction || !assets?.stumbleAction || state.isDisposed) {
      return;
    }

    state.isStumbling = true;
    assets.stumbleAction.reset().play();
    assets.waveAction.crossFadeTo(assets.stumbleAction, CONFIG.CROSS_FADE_DURATION, true);

    setTimeout(() => {
      if (state.isDisposed || !assets.waveAction || !assets.stumbleAction) return;

      assets.waveAction.reset().play();
      assets.stumbleAction.crossFadeTo(assets.waveAction, 1, true);

      setTimeout(() => {
        state.isStumbling = false;
      }, CONFIG.RECOVERY_DURATION);
    }, CONFIG.STUMBLE_DURATION);
  }, [assetsRef, stateRef]);

  const handleAvatarClick = useCallback((): void => {
    const assets = assetsRef.current;
    const state = stateRef.current;

    if (!assets?.waveAction || state.isStumbling || state.isDisposed) {
      return;
    }

    if (!state.isAnimationPlaying) {
      assets.waveAction.reset().play();
      state.isAnimationPlaying = true;
    } else if (assets.stumbleAction) {
      executeStumbleSequence();
    }
  }, [executeStumbleSequence, assetsRef, stateRef]);

  return { handleAvatarClick };
};

// Хук для обработки размеров и масштабирования
const useScaleManager = () => {
  const calculateScale = useCallback((width: number, height: number): number => {
    const scale = Math.min(width, height) / CONFIG.BASE_SIZE;
    return Math.max(CONFIG.MIN_SCALE, Math.min(CONFIG.MAX_SCALE, scale));
  }, []);

  const updateSize = useCallback(
    (
      container: HTMLElement,
      scene: AvatarScene,
      assets: AvatarAssets | null,
      calculateScaleFn: (width: number, height: number) => number,
    ): void => {
      const { clientWidth: width, clientHeight: height } = container;

      if (width === 0 || height === 0) {
        console.warn('Container has zero dimensions:', { width, height });
        return;
      }

      scene.camera.aspect = width / height;
      scene.camera.updateProjectionMatrix();
      scene.renderer.setSize(width, height);

      if (assets?.avatar) {
        const scale = calculateScaleFn(width, height);
        assets.avatar.scale.setScalar(scale);
        assets.groundMesh.scale.setScalar(scale);
      }
    },
    [],
  );

  return { calculateScale, updateSize };
};

// Хук для обработки событий мыши
const useMouseHandler = (handleAvatarClick: () => void) => {
  const handleMouseClick = useCallback(
    (event: MouseEvent, container: HTMLElement, scene: AvatarScene): void => {
      const rect = container.getBoundingClientRect();
      const coords = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(coords, scene.camera);

      const intersects = raycaster.intersectObjects(scene.scene.children, true);

      if (intersects.length > 0) {
        handleAvatarClick();
      }
    },
    [handleAvatarClick],
  );

  const handleMouseMove = useCallback(
    (
      event: MouseEvent,
      container: HTMLElement,
      scene: AvatarScene,
      assetsRef: React.RefObject<AvatarAssets | null>,
    ): void => {
      const rect = container.getBoundingClientRect();
      const coords = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(coords, scene.camera);

      const intersects = raycaster.intersectObjects(scene.scene.children, true);

      // Проверяем наведение именно на аватар (не на groundMesh)
      const avatarIntersection = intersects.find(
        (intersect) => intersect.object !== assetsRef.current?.groundMesh,
      );

      if (avatarIntersection) {
        container.dispatchEvent(
          new CustomEvent('avatarHover', {
            detail: { x: event.clientX, y: event.clientY },
          }),
        );
      } else {
        container.dispatchEvent(new CustomEvent('avatarLeave'));
      }
    },
    [],
  );

  return { handleMouseClick, handleMouseMove };
};

// Хук для обработки загрузки модели (уменьшено количество параметров)
interface ModelHandlerDeps {
  setupMeshProperties: (avatar: THREE.Group) => void;
  createGround: () => THREE.Mesh;
  setupAnimations: (
    gltf: GLTF,
    mixer: THREE.AnimationMixer,
  ) => {
    waveAction: THREE.AnimationAction | null;
    stumbleAction: THREE.AnimationAction | null;
  };
}

interface ModelHandlerContext {
  calculateScale: (width: number, height: number) => number;
  assetsRef: React.RefObject<AvatarAssets | null>;
  stateRef: React.RefObject<AvatarState>;
  refs: React.RefObject<AvatarRefs>;
}

const useModelHandler = (deps: ModelHandlerDeps, ctx: ModelHandlerContext) => {
  const { setupMeshProperties, createGround, setupAnimations } = deps;
  const { calculateScale, assetsRef, stateRef, refs } = ctx;

  const handleModelLoaded = useCallback(
    (gltf: GLTF, scene: AvatarScene): void => {
      if (stateRef.current.isDisposed) return;

      const avatar = gltf.scene;
      setupMeshProperties(avatar);

      const groundMesh = createGround();
      const mixer = new THREE.AnimationMixer(avatar);
      const { waveAction, stumbleAction } = setupAnimations(gltf, mixer);

      if (!waveAction && !stumbleAction) {
        console.warn('No animations found in model');
        return;
      }

      scene.scene.add(avatar, groundMesh);

      assetsRef.current = {
        avatar,
        groundMesh,
        mixer,
        waveAction,
        stumbleAction,
      };

      refs.current.avatar = avatar;
      refs.current.groundMesh = groundMesh;
      refs.current.mixer = mixer;

      const container = refs.current.container!;
      const scale = calculateScale(container.clientWidth, container.clientHeight);
      avatar.scale.setScalar(scale);
      groundMesh.scale.setScalar(scale);

      container.dispatchEvent(new CustomEvent('modelLoaded'));
    },
    [setupMeshProperties, createGround, setupAnimations, calculateScale, assetsRef, stateRef, refs],
  );

  const loadModel = useCallback(
    (scene: AvatarScene): void => {
      const loader = new GLTFLoader();

      loader.load(
        avatarConfig.modelPath,
        (gltf) => handleModelLoaded(gltf, scene),
        undefined,
        (error) => console.error('Error loading model:', error),
      );
    },
    [handleModelLoaded],
  );

  return { loadModel };
};

// Хук для анимационного цикла
const useAnimationLoop = (
  sceneRef: React.RefObject<AvatarScene | null>,
  assetsRef: React.RefObject<AvatarAssets | null>,
  stateRef: React.RefObject<AvatarState>,
) => {
  const animate = useCallback((): void => {
    const scene = sceneRef.current;
    const assets = assetsRef.current;
    const state = stateRef.current;

    if (state.isDisposed || !scene) return;

    requestAnimationFrame(animate);

    assets?.mixer.update(scene.clock.getDelta());
    scene.controls.update();
    scene.renderer.render(scene.scene, scene.camera);
  }, [sceneRef, assetsRef, stateRef]);

  return { animate };
};

// Хук для очистки ресурсов (уменьшено количество параметров)
interface CleanupContext {
  stateRef: React.RefObject<AvatarState>;
  sceneRef: React.RefObject<AvatarScene | null>;
  assetsRef: React.RefObject<AvatarAssets | null>;
  refs: React.RefObject<AvatarRefs>;
}

const useCleanup = (ctx: CleanupContext) => {
  const { stateRef, sceneRef, assetsRef } = ctx;
  const cleanup = useCallback((): void => {
    stateRef.current.isDisposed = true;

    const scene = sceneRef.current;
    const assets = assetsRef.current;

    if (assets?.mixer) {
      assets.mixer.stopAllAction();
    }

    if (scene) {
      scene.renderer.dispose();
      scene.renderer.domElement.remove();
      scene.controls.dispose();
    }

    if (assets?.groundMesh) {
      assets.groundMesh.geometry.dispose();
      (assets.groundMesh.material as THREE.Material).dispose();
    }

    sceneRef.current = null;
    assetsRef.current = null;
  }, [stateRef, sceneRef, assetsRef]);

  return { cleanup };
};

// eslint-disable-next-line max-lines-per-function
export const useAvatar = () => {
  const refs = useRef<AvatarRefs>({ container: null });
  const sceneRef = useRef<AvatarScene | null>(null);
  const assetsRef = useRef<AvatarAssets | null>(null);
  const stateRef = useRef<AvatarState>({
    isAnimationPlaying: false,
    isStumbling: false,
    isDisposed: false,
  });

  const { createRenderer, createCameraAndControls, setupLighting } = useSceneSetup();
  const { createGround, setupAnimations, setupMeshProperties } = useModelLoader();
  const { handleAvatarClick } = useAnimationControl(assetsRef, stateRef);
  const { calculateScale, updateSize } = useScaleManager();
  const { handleMouseClick, handleMouseMove } = useMouseHandler(handleAvatarClick);
  const { loadModel } = useModelHandler(
    { setupMeshProperties, createGround, setupAnimations },
    { calculateScale, assetsRef, stateRef, refs },
  );
  const { animate } = useAnimationLoop(sceneRef, assetsRef, stateRef);
  const { cleanup } = useCleanup({ stateRef, sceneRef, assetsRef, refs });

  const handleMouseClickWrapper = useCallback(
    (event: MouseEvent): void => {
      const container = refs.current.container;
      const scene = sceneRef.current;

      if (!container || !scene) return;

      handleMouseClick(event, container, scene);
    },
    [handleMouseClick],
  );

  const handleResize = useCallback((): void => {
    const container = refs.current.container;
    const scene = sceneRef.current;
    const assets = assetsRef.current;

    if (!container || !scene) return;
    updateSize(container, scene, assets, calculateScale);
  }, [updateSize, calculateScale]);

  // eslint-disable-next-line max-lines-per-function
  useEffect(() => {
    const container = refs.current.container;
    if (!container) return;

    try {
      const renderer = createRenderer(container);
      const { camera, controls } = createCameraAndControls(renderer);
      const scene = new THREE.Scene();
      const clock = new THREE.Clock();

      const sceneData: AvatarScene = {
        renderer,
        camera,
        scene,
        controls,
        clock,
      };

      sceneRef.current = sceneData;

      setupLighting(scene);
      loadModel(sceneData);

      // Observe theme changes to update podium color dynamically
      const themeObserver = new MutationObserver(() => {
        const assets = assetsRef.current;
        if (assets?.groundMesh) {
          const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--avatar-podium-color')
            .trim();
          try {
            (assets.groundMesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(
              color || '#e0e0e0',
            );
            (assets.groundMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
          } catch {
            // noop
          }
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      container.addEventListener('mousedown', handleMouseClickWrapper);
      const mouseMoveHandler = (event: MouseEvent) =>
        handleMouseMove(event, container, sceneData, assetsRef);
      container.addEventListener('mousemove', mouseMoveHandler);
      let rafId = 0;
      const onResizeFrame = (): void => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => handleResize());
      };
      window.addEventListener('resize', onResizeFrame);

      const resizeObserver = new ResizeObserver(onResizeFrame);
      resizeObserver.observe(container);

      refs.current.renderer = renderer;
      refs.current.camera = camera;
      refs.current.scene = scene;
      refs.current.clock = clock;
      refs.current.controls = controls;

      animate();

      return () => {
        window.removeEventListener('resize', onResizeFrame);
        if (container) {
          container.removeEventListener('mousedown', handleMouseClickWrapper);
          container.removeEventListener('mousemove', mouseMoveHandler);
        }
        resizeObserver.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
        try { themeObserver.disconnect(); } catch {}
        cleanup();
      };
    } catch (error) {
      console.error('Failed to initialize avatar:', error);
    }
  }, [
    createRenderer,
    createCameraAndControls,
    setupLighting,
    loadModel,
    handleMouseClickWrapper,
    handleResize,
    handleMouseMove,
    animate,
    cleanup,
  ]);

  return refs;
};
