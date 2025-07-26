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
