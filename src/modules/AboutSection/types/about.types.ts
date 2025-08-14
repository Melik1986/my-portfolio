export interface AboutSectionProps {
  // Основные пропсы для AboutSection
  className?: string;
}

export interface AboutContentProps {
  // Пропсы для AboutContent
  className?: string;
}

export interface AboutGalleryProps {
  // Пропсы для AboutGallery
  className?: string;
}

export interface AboutAnimationProps {
  // Пропсы для AboutAnimation
  className?: string;
}

export interface AuroraConfig {
  separation: number;
  amountX: number;
  amountY: number;
  particleColor: number;
  particleSize: number;
  cameraSpeed: number;
  waveSpeed: number;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  cameraZ: number;
  cameraLerp: number;
  waveFrequencyX: number;
  waveFrequencyY: number;
  waveAmplitude: number;
  // Новые свойства для GPU-анимации
  cameraEase: number;
  cameraMaxOffset: number;
  particles: {
    color: string;
    size: number;
  };
  wave: {
    speed: number;
    amplitude: number;
    frequency: number;
  };
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface ParticleData {
  ix: number;
  iy: number;
}

export interface AuroraState {
  isRunning: boolean;
  isInitialized: boolean;
  mousePosition: MousePosition;
}

export interface AvatarConfig {
  modelPath: string;
  pedestalColor: number;
}

export interface AvatarControls {
  enableDamping: boolean;
  enablePan: boolean;
  enableZoom: boolean;
  minDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  target: THREE.Vector3;
}

export interface AvatarAnimationState {
  isAnimationPlaying: boolean;
  isStumbling: boolean;
}

export interface AvatarRefs {
  container: HTMLDivElement | null;
  renderer?: THREE.WebGLRenderer;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  avatar?: THREE.Group; // Добавляем ссылку на аватар
  groundMesh?: THREE.Mesh; // Добавляем ссылку на подиум
  mixer?: THREE.AnimationMixer;
  clock?: THREE.Clock;
  controls?: { update: () => void; dispose?: () => void }; // OrbitControls with required methods
}
