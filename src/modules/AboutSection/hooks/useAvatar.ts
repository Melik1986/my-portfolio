'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
// three/examples: use type-only imports and dynamic import for runtime to optimize bundle
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { avatarConfig } from '../config/avatar3d.config';
import { AvatarRefs } from '../types/about.types';
import { AvatarAssets, AvatarScene, AvatarState } from '../types/avatar.types';
import { getNDCFromMouse } from '../utils/avatar.utils';
import { useModelLoader, useThemeObserverEffect } from './useAvatarModel';
import { useSceneSetup } from './useAvatarScene';

// Константы конфигурации
const CONFIG = {
  BASE_SIZE: 660, // Base size for scaling (увеличено на 10% с 580 до 638 для уменьшения модели)
  MIN_SCALE: 0.5, // Minimum scale factor
  MAX_SCALE: 1.5, // Maximum scale factor
  CAMERA_FOV: 25,
  CAMERA_NEAR: 0.1,
  CROSS_FADE_DURATION: 0.3,
  STUMBLE_DURATION: 4000,
  RECOVERY_DURATION: 1000,
} as const;

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

const getIntersections = (ndc: THREE.Vector2, scene: AvatarScene): THREE.Intersection[] => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(ndc, scene.camera);
  return raycaster.intersectObjects(scene.scene.children, true);
};

const isHoveringAvatar = (intersects: THREE.Intersection[], groundMesh?: THREE.Mesh): boolean => {
  return intersects.some((i) => i.object !== groundMesh);
};

const dispatchAvatarHover = (container: HTMLElement, rect: DOMRect): void => {
  const centerX = rect.left + rect.width / 2;
  const y = rect.top + 60;
  container.dispatchEvent(
    new CustomEvent('avatarHover', {
      detail: { x: centerX, y },
    }),
  );
};

const dispatchAvatarLeave = (container: HTMLElement): void => {
  container.dispatchEvent(new CustomEvent('avatarLeave'));
};

// Хук для обработки событий мыши
const useMouseHandler = (handleAvatarClick: () => void) => {
  const handleMouseClick = useCallback(
    (event: MouseEvent, container: HTMLElement, scene: AvatarScene): void => {
      const rect = container.getBoundingClientRect();
      const ndc = getNDCFromMouse(event, rect);
      const intersects = getIntersections(ndc, scene);
      if (intersects.length > 0) handleAvatarClick();
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
      const ndc = getNDCFromMouse(event, rect);
      const intersects = getIntersections(ndc, scene);
      const hovering = isHoveringAvatar(intersects, assetsRef.current?.groundMesh);
      if (hovering) dispatchAvatarHover(container, rect);
      else dispatchAvatarLeave(container);
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

// Глобальный кэш загрузки модели (переживает размонтирование StrictMode)
let sharedModelPromise: Promise<GLTF> | null = null;
let sharedModelGLTF: GLTF | null = null;

const loadGLTFViaLoader = async (url: string): Promise<GLTF> => {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const loader = new GLTFLoader();
  try {
    (loader as unknown as { crossOrigin?: string }).crossOrigin = 'anonymous';
  } catch {}
  return await new Promise<GLTF>((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
};

const fetchModelOnce = async (): Promise<GLTF> => {
  if (sharedModelGLTF) {
    return sharedModelGLTF;
  }
  if (!sharedModelPromise) {
    sharedModelPromise = loadGLTFViaLoader(avatarConfig.modelPath)
      .then((gltf) => {
        sharedModelGLTF = gltf;
        return gltf;
      })
      .finally(() => {
        sharedModelPromise = null;
      });
  } else {
  }
  return (await (sharedModelGLTF ? Promise.resolve(sharedModelGLTF) : sharedModelPromise!)) as GLTF;
};

const cloneForScene = async (gltf: GLTF): Promise<GLTF> => {
  const mod = await import('three/examples/jsm/utils/SkeletonUtils.js');
  const utils: unknown =
    (mod as unknown as { SkeletonUtils?: unknown; default?: unknown }).SkeletonUtils ??
    (mod as unknown as { default?: unknown }).default ??
    mod;
  // @ts-expect-error — динамическое извлечение утилиты с методом clone
  const cloner: ((obj: THREE.Object3D) => THREE.Object3D) | undefined =
    utils && (utils as { clone?: (o: THREE.Object3D) => THREE.Object3D }).clone;
  const scene = cloner
    ? (cloner(gltf.scene) as THREE.Group)
    : (gltf.scene.clone(true) as THREE.Group);
  return { ...gltf, scene } as GLTF;
};
const centerModelAndFitCamera = (avatar: THREE.Group, scene: AvatarScene): void => {
  const box = new THREE.Box3().setFromObject(avatar);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  avatar.position.sub(center);
  const boxAfter = new THREE.Box3().setFromObject(avatar);
  const minY = boxAfter.min.y;
  avatar.position.y -= minY;
  const fov = (scene.camera.fov * Math.PI) / 180;
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim / (2 * Math.tan(fov / 2)) + 0.6;
  scene.camera.position.set(0.6, size.y * 0.7 + 0.4, distance);
  scene.controls.target.set(0, size.y * 0.5, 0);
  scene.controls.update();
};

const createAssets = (
  gltf: GLTF,
  avatar: THREE.Group,
  createGround: () => THREE.Mesh,
  setupAnimations: (
    gltf: GLTF,
    mixer: THREE.AnimationMixer,
  ) => { waveAction: THREE.AnimationAction | null; stumbleAction: THREE.AnimationAction | null },
): AvatarAssets => {
  const groundMesh = createGround();
  const mixer = new THREE.AnimationMixer(avatar);
  const { waveAction, stumbleAction } = setupAnimations(gltf, mixer);
  return { avatar, groundMesh, mixer, waveAction, stumbleAction };
};

const applyInitialSizing = (
  container: HTMLElement,
  scene: AvatarScene,
  assets: AvatarAssets,
  calculateScale: (w: number, h: number) => number,
): void => {
  const scale = calculateScale(container.clientWidth, container.clientHeight);
  assets.avatar.scale.setScalar(scale);
  assets.groundMesh.scale.setScalar(scale);
  scene.camera.aspect = container.clientWidth / container.clientHeight;
  scene.camera.updateProjectionMatrix();
  scene.renderer.setSize(container.clientWidth, container.clientHeight);
};

const updateRefsAfterLoad = (refs: React.RefObject<AvatarRefs>, assets: AvatarAssets): void => {
  refs.current.avatar = assets.avatar;
  refs.current.groundMesh = assets.groundMesh;
  refs.current.mixer = assets.mixer;
};

let isModelLoading = false;

// Вспомогательные функции для загрузки/замены модели (сокращают тело useModelHandler)
const disposeAssets = (scene: AvatarScene, prev?: AvatarAssets | null): void => {
  if (!prev) return;
  try {
    prev.mixer.stopAllAction();
    scene.scene.remove(prev.avatar);
    scene.scene.remove(prev.groundMesh);
    prev.groundMesh.geometry.dispose();
    (prev.groundMesh.material as THREE.Material).dispose();
  } catch {}
};

const handleModelLoadedImpl = (
  gltf: GLTF,
  deps: ModelHandlerDeps,
  ctx: ModelHandlerContext,
  scene: AvatarScene,
): void => {
  if (ctx.stateRef.current.isDisposed) return;

  // удалить предыдущее состояние, если было
  disposeAssets(scene, ctx.assetsRef.current);

  const avatar = gltf.scene;
  deps.setupMeshProperties(avatar);
  const assets = createAssets(gltf, avatar, deps.createGround, deps.setupAnimations);

  try {
    centerModelAndFitCamera(avatar, scene);
  } catch {}

  scene.scene.add(avatar, assets.groundMesh);
  ctx.assetsRef.current = assets;
  updateRefsAfterLoad(ctx.refs, assets);

  const container = ctx.refs.current.container;
  if (container) {
    try {
      applyInitialSizing(container, scene, assets, ctx.calculateScale);
    } catch {}
    container.dispatchEvent(new CustomEvent('modelLoaded'));
  }
};

const useModelHandler = (
  deps: ModelHandlerDeps,
  ctx: ModelHandlerContext,
  sceneRef: React.RefObject<AvatarScene | null>,
) => {
  const { setupMeshProperties, createGround, setupAnimations } = deps;
  const { assetsRef, stateRef, refs, calculateScale } = ctx;

  const handleModelLoaded = useCallback(
    (gltf: GLTF): void => {
      const scene = sceneRef.current;
      if (!scene || stateRef.current.isDisposed) return;
      handleModelLoadedImpl(
        gltf,
        { setupMeshProperties, createGround, setupAnimations },
        { calculateScale, assetsRef, stateRef, refs },
        scene,
      );
    },
    [
      setupMeshProperties,
      createGround,
      setupAnimations,
      sceneRef,
      stateRef,
      assetsRef,
      refs,
      calculateScale,
    ],
  );

  const loadModel = useCallback(async (): Promise<void> => {
    if (assetsRef.current || isModelLoading) return;
    isModelLoading = true;

    try {
      const base = await fetchModelOnce();
      if (stateRef.current.isDisposed) {
        return;
      }

      const gltf = await cloneForScene(base);
      if (stateRef.current.isDisposed) {
        return;
      }

      handleModelLoaded(gltf);
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      isModelLoading = false;
    }
  }, [assetsRef, handleModelLoaded, stateRef]);

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

    if (state.isDisposed || !scene) {
      return;
    }

    // Останавливаем цикл, если компонент не видим
    if (!state.isVisible) {
      return;
    }

    requestAnimationFrame(animate);

    const delta = scene.clock.getDelta();
    assets?.mixer.update(delta);
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
    const scene = sceneRef.current;
    const assets = assetsRef.current;

    // Остановка анимаций
    if (assets?.mixer) {
      assets.mixer.stopAllAction();
      assets.mixer.uncacheRoot(assets.mixer.getRoot());
    }

    // Очистка сцены и всех объектов
    if (scene) {
      // Рекурсивная очистка всех объектов в сцене
      scene.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              (object.material as THREE.Material).dispose();
            }
          }
        }
      });

      // Очистка сцены
      scene.scene.clear();

      // Очистка контролов
      scene.controls.dispose();

      // Удаление canvas из DOM
      const canvas = scene.renderer.domElement;
      const parent = canvas.parentElement;
      if (parent) {
        parent.removeChild(canvas);
      }

      // Принудительная очистка WebGL контекста
      scene.renderer.forceContextLoss();
      scene.renderer.dispose();
    }

    // Очистка ссылок
    sceneRef.current = null;
    assetsRef.current = null;
    stateRef.current.isDisposed = true;
  }, [stateRef, sceneRef, assetsRef]);

  return { cleanup };
};

// Создание сцены и сохранение ссылок
const createSceneData = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
): AvatarScene => {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  return { renderer, camera, scene, controls, clock };
};

// Сохранение ссылок на компоненты сцены
const saveSceneRefs = (
  refs: React.RefObject<AvatarRefs>,
  sceneData: AvatarScene,
): void => {
  refs.current.renderer = sceneData.renderer;
  refs.current.camera = sceneData.camera;
  refs.current.scene = sceneData.scene;
  refs.current.clock = sceneData.clock;
  refs.current.controls = sceneData.controls;
};

// Инициализация 3D сцены
const initializeScene = async (
  container: HTMLElement,
  ctx: {
    createRenderer: (container: HTMLElement) => THREE.WebGLRenderer;
    createCameraAndControls: (renderer: THREE.WebGLRenderer) => {
      camera: THREE.PerspectiveCamera;
      controls: OrbitControls;
    };
    setupLighting: (scene: THREE.Scene) => void;
    sceneRef: React.RefObject<AvatarScene | null>;
    stateRef: React.RefObject<AvatarState>;
    refs: React.RefObject<AvatarRefs>;
    animate: () => void;
  },
  cancelled: { value: boolean },
): Promise<void> => {
  try {
    const renderer = ctx.createRenderer(container);
    const { clientWidth, clientHeight } = container;
    if (clientWidth && clientHeight) renderer.setSize(clientWidth, clientHeight);

    const { camera, controls } = ctx.createCameraAndControls(renderer);
    if (cancelled.value) return;

    const sceneData = createSceneData(renderer, camera, controls);
    ctx.sceneRef.current = sceneData;
    ctx.stateRef.current.isDisposed = false;

    ctx.setupLighting(sceneData.scene);
    saveSceneRefs(ctx.refs, sceneData);
    ctx.animate();
  } catch (error) {
    console.error('Failed to initialize avatar:', error);
  }
};

// Интерфейс для контекста инициализации
interface InitializationContext {
  refs: React.RefObject<AvatarRefs>;
  sceneRef: React.RefObject<AvatarScene | null>;
  stateRef: React.RefObject<AvatarState>;
  createRenderer: (container: HTMLElement) => THREE.WebGLRenderer;
  createCameraAndControls: (renderer: THREE.WebGLRenderer) => {
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
  };
  setupLighting: (scene: THREE.Scene) => void;
  animate: () => void;
  cleanup: () => void;
  isInitializedRef: React.MutableRefObject<boolean>;
}

// Инициализация сцены, камеры, контролов и запуска анимационного цикла как отдельный хук
const useInitializationEffect = (ctx: InitializationContext): void => {
  const {
    refs,
    sceneRef,
    stateRef,
    createRenderer,
    createCameraAndControls,
    setupLighting,
    animate,
    cleanup,
    isInitializedRef,
  } = ctx;
  
  useEffect(() => {
    const container = refs.current.container;
    if (!container || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const cancelled = { value: false };
    void initializeScene(
      container,
      { createRenderer, createCameraAndControls, setupLighting, sceneRef, stateRef, refs, animate },
      cancelled,
    );

    return () => {
      cancelled.value = true;
      cleanup();
      isInitializedRef.current = false;
    };
  }, [
    createRenderer,
    createCameraAndControls,
    setupLighting,
    animate,
    cleanup,
    refs,
    sceneRef,
    stateRef,
    isInitializedRef,
  ]);
};

// Слушатели мыши и ресайза как отдельный хук
const bindMouseHandlers = ({
  container,
  sceneData,
  assetsRef,
  handleMouseClickWrapper,
  handleMouseMove,
}: {
  container: HTMLElement;
  sceneData: AvatarScene;
  assetsRef: React.RefObject<AvatarAssets | null>;
  handleMouseClickWrapper: (e: MouseEvent) => void;
  handleMouseMove: (
    event: MouseEvent,
    container: HTMLElement,
    scene: AvatarScene,
    assetsRef: React.RefObject<AvatarAssets | null>,
  ) => void;
}): (() => void) => {
  const mouseMoveHandler = (event: MouseEvent) =>
    handleMouseMove(event, container, sceneData, assetsRef);

  container.addEventListener('mousedown', handleMouseClickWrapper);
  container.addEventListener('mousemove', mouseMoveHandler);

  return () => {
    container.removeEventListener('mousedown', handleMouseClickWrapper);
    container.removeEventListener('mousemove', mouseMoveHandler);
  };
};

const bindResizeHandlers = ({
  container,
  handleResize,
}: {
  container: HTMLElement;
  handleResize: () => void;
}): (() => void) => {
  let rafId = 0;
  let resizeTimeout: NodeJS.Timeout | null = null;

  const onWindowResize = (): void => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => handleResize());
  };

  const onContainerResize = (): void => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => handleResize());
    }, 16);
  };

  window.addEventListener('resize', onWindowResize);
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        onContainerResize();
        break;
      }
    }
  });
  resizeObserver.observe(container);

  return () => {
    window.removeEventListener('resize', onWindowResize);
    resizeObserver.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    if (resizeTimeout) clearTimeout(resizeTimeout);
  };
};

const bindAvatarEventListeners = ({
  container,
  sceneData,
  assetsRef,
  handleMouseClickWrapper,
  handleMouseMove,
  handleResize,
}: {
  container: HTMLElement;
  sceneData: AvatarScene;
  assetsRef: React.RefObject<AvatarAssets | null>;
  handleMouseClickWrapper: (e: MouseEvent) => void;
  handleMouseMove: (
    event: MouseEvent,
    container: HTMLElement,
    scene: AvatarScene,
    assetsRef: React.RefObject<AvatarAssets | null>,
  ) => void;
  handleResize: () => void;
}): (() => void) => {
  const unbindMouse = bindMouseHandlers({
    container,
    sceneData,
    assetsRef,
    handleMouseClickWrapper,
    handleMouseMove,
  });

  const unbindResize = bindResizeHandlers({ container, handleResize });

  return () => {
    unbindMouse();
    unbindResize();
  };
};

const useEventBindingsEffect = (ctx: {
  refs: React.RefObject<AvatarRefs>;
  sceneRef: React.RefObject<AvatarScene | null>;
  assetsRef: React.RefObject<AvatarAssets | null>;
  handleMouseClickWrapper: (e: MouseEvent) => void;
  handleMouseMove: (
    event: MouseEvent,
    container: HTMLElement,
    scene: AvatarScene,
    assetsRef: React.RefObject<AvatarAssets | null>,
  ) => void;
  handleResize: () => void;
}): void => {
  const { refs, sceneRef, assetsRef, handleMouseClickWrapper, handleMouseMove, handleResize } = ctx;
  useEffect(() => {
    const container = refs.current.container;
    const sceneData = sceneRef.current;
    if (!container || !sceneData) return;

    const unbind = bindAvatarEventListeners({
      container,
      sceneData,
      assetsRef,
      handleMouseClickWrapper,
      handleMouseMove,
      handleResize,
    });

    return () => {
      unbind();
    };
  }, [handleMouseClickWrapper, handleMouseMove, handleResize, refs, sceneRef, assetsRef]);
};

// Отдельный хук для загрузки модели (без повторной загрузки)
const useLoadModelEffect = (
  sceneRef: React.RefObject<AvatarScene | null>,
  stateRef: React.RefObject<AvatarState>,
  assetsRef: React.RefObject<AvatarAssets | null>,
  loadModel: () => Promise<void>,
): void => {
  useEffect(() => {
    if (!sceneRef.current || stateRef.current.isDisposed) return;
    if (assetsRef.current) return;
    void loadModel();
  }, [sceneRef, stateRef, assetsRef, loadModel]);
};

// Небольшие хелперы-обёртки для коллбеков, чтобы сократить размер основного хука
const useHandleMouseClickWrapper = (
  refs: React.RefObject<AvatarRefs>,
  sceneRef: React.RefObject<AvatarScene | null>,
  handleMouseClick: (event: MouseEvent, container: HTMLElement, scene: AvatarScene) => void,
): ((e: MouseEvent) => void) =>
  useCallback(
    (event: MouseEvent): void => {
      const container = refs.current.container;
      const scene = sceneRef.current;
      if (!container || !scene) return;
      handleMouseClick(event, container, scene);
    },
    [handleMouseClick, refs, sceneRef],
  );

const useHandleResize = ({
  refs,
  sceneRef,
  assetsRef,
  updateSize,
  calculateScale,
}: {
  refs: React.RefObject<AvatarRefs>;
  sceneRef: React.RefObject<AvatarScene | null>;
  assetsRef: React.RefObject<AvatarAssets | null>;
  updateSize: (
    container: HTMLElement,
    scene: AvatarScene,
    assets: AvatarAssets | null,
    calculateScale: (w: number, h: number) => number,
  ) => void;
  calculateScale: (w: number, h: number) => number;
}): (() => void) =>
  useCallback((): void => {
    const container = refs.current.container;
    const scene = sceneRef.current;
    if (!container || !scene) return;

    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;

    const assets = assetsRef.current;
    updateSize(container, scene, assets, calculateScale);
  }, [updateSize, calculateScale, refs, sceneRef, assetsRef]);

// Эффект подписки на кастомное событие видимости, чтобы ставить/снимать паузу у RAF
const useVisibilityEventsEffect = (
  refs: React.RefObject<AvatarRefs>,
  stateRef: React.RefObject<AvatarState>,
  assetsRef: React.RefObject<AvatarAssets | null>,
  animate: () => void,
): void => {
  useEffect(() => {
    const container = refs.current.container;
    if (!container) return;

    const onVisibility = (e: Event) => {
      try {
        const detail = (e as CustomEvent<{ isVisible: boolean }>).detail;
        const isVisible = !!detail?.isVisible;
        stateRef.current.isVisible = isVisible;
        if (isVisible) {
          // Перезапускаем цикл анимации при появлении
          animate();
        } else {
          // Останавливаем и сбрасываем анимацию при скрытии
          const assets = assetsRef.current;
          const state = stateRef.current;
          if (assets?.waveAction && state.isAnimationPlaying) {
            assets.waveAction.stop();
            state.isAnimationPlaying = false;
          }
        }
      } catch {}
    };

    container.addEventListener('avatarVisibility', onVisibility as EventListener);
    return () => {
      container.removeEventListener('avatarVisibility', onVisibility as EventListener);
    };
  }, [refs, stateRef, assetsRef, animate]);
};
export const useAvatar = () => {
  const refs = useRef<AvatarRefs>({ container: null });
  const sceneRef = useRef<AvatarScene | null>(null);
  const assetsRef = useRef<AvatarAssets | null>(null);
  const stateRef = useRef<AvatarState>({
    isAnimationPlaying: false,
    isStumbling: false,
    isDisposed: false,
    isVisible: true,
  });
  const isInitializedRef = useRef(false);

  const { createRenderer, createCameraAndControls, setupLighting } = useSceneSetup();
  const { createGround, setupAnimations, setupMeshProperties } = useModelLoader();
  const { handleAvatarClick } = useAnimationControl(assetsRef, stateRef);
  const { calculateScale, updateSize } = useScaleManager();
  const { handleMouseClick, handleMouseMove } = useMouseHandler(handleAvatarClick);
  const { loadModel } = useModelHandler(
    { setupMeshProperties, createGround, setupAnimations },
    { calculateScale, assetsRef, stateRef, refs },
    sceneRef,
  );
  const { animate } = useAnimationLoop(sceneRef, assetsRef, stateRef);
  const { cleanup } = useCleanup({ stateRef, sceneRef, assetsRef, refs });

  const handleMouseClickWrapper = useHandleMouseClickWrapper(refs, sceneRef, handleMouseClick);
  const handleResize = useHandleResize({ refs, sceneRef, assetsRef, updateSize, calculateScale });

  useInitializationEffect({
    refs,
    sceneRef,
    stateRef,
    createRenderer,
    createCameraAndControls,
    setupLighting,
    animate,
    cleanup,
    isInitializedRef,
  });

  useEventBindingsEffect({
    refs,
    sceneRef,
    assetsRef,
    handleMouseClickWrapper,
    handleMouseMove,
    handleResize,
  });

  // Подписка на событие видимости от компонента 3DAvatar
  useVisibilityEventsEffect(refs, stateRef, assetsRef, animate);

  useLoadModelEffect(sceneRef, stateRef, assetsRef, loadModel);
  useThemeObserverEffect(assetsRef);

  return refs;
};
