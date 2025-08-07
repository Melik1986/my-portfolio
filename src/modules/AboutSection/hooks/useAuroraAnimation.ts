import { useRef, useEffect } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Points,
  AdditiveBlending,
  Color,
} from 'three';
import { DEFAULT_AURORA_CONFIG } from '@/modules/AboutSection/config/aurora.config';

function createCamera(container: HTMLDivElement, config: typeof DEFAULT_AURORA_CONFIG) {
  const camera = new PerspectiveCamera(
    config.cameraFov,
    container.offsetWidth / container.offsetHeight,
    config.cameraNear,
    config.cameraFar,
  );
  camera.position.z = config.cameraZ;
  return camera;
}

function createGeometry(config: typeof DEFAULT_AURORA_CONFIG) {
  const positions = new Float32Array(config.amountX * config.amountY * 3);
  let i = 0;
  for (let ix = 0; ix < config.amountX; ix++) {
    for (let iy = 0; iy < config.amountY; iy++) {
      positions[i++] = ix * config.separation - (config.amountX * config.separation) / 2;
      positions[i++] = 0;
      positions[i++] = iy * config.separation - (config.amountY * config.separation) / 2;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

function createMaterial(config: typeof DEFAULT_AURORA_CONFIG) {
  return new ShaderMaterial({
    uniforms: {
      color: { value: new Color(config.particleColor) },
      opacity: { value: 1.0 },
    },
    vertexShader: `
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = ${config.particleSize} * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      void main() {
        if (dot(gl_PointCoord - 0.5, gl_PointCoord - 0.5) > 0.25) discard;
        gl_FragColor = vec4(color, opacity);
      }`,
    blending: AdditiveBlending,
    depthTest: false,
    transparent: true,
  });
}

function createRenderer(container: HTMLDivElement) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

/**
 * Хук для инициализации и настройки сцены three.js.
 * @param containerRef - Ref на DOM-контейнер для анимации.
 * @param config - Объект конфигурации анимации.
 * @returns Ref-объекты для сцены, камеры и рендерера.
 */
export const useAuroraAnimation = (containerRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const config = DEFAULT_AURORA_CONFIG;
    const camera = createCamera(container, config);
    cameraRef.current = camera;
    const scene = new Scene();
    sceneRef.current = scene;
    const geometry = createGeometry(config);
    const material = createMaterial(config);
    const particles = new Points(geometry, material);
    scene.add(particles);
    const renderer = createRenderer(container);
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);
  return { sceneRef, cameraRef, rendererRef };
};
