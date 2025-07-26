export interface SpiralConfig {
  numIcons: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  animationDuration: number;
  elementSpacing: number;
}

export interface IconData {
  name: string;
  id: string;
  color: string;
}

export interface SpiralIcon {
  element: SVGElement;
  index: number;
  offset: number;
}

export interface SpiralState {
  isInitialized: boolean;
  isAnimating: boolean;
  icons: SpiralIcon[];
}
